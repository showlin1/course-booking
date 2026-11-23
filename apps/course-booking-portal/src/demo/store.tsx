import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useCourses, parseDate } from '../courses';
import { buildSeed, makeRef, uid } from './seed';
import type { Booking, CourseSession, DemoDb, Promo } from './types';

/*
 * API service layer — DEMO implementation.
 * Every action below is the single place to swap in a real backend:
 *  - availability / sessions  → Wix Bookings (services + availability calendar)
 *  - createPendingBooking     → Wix Bookings create booking (pending)
 *  - processPayment           → Wix eCommerce checkout; payment must be verified server-side
 *  - validatePromo            → Wix coupons, validated by the backend
 *  - sendEmail                → authenticated email integration
 * Until then data is stored in this browser only (localStorage).
 */

const KEY = 'kanova-demo-db-v1';
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

type Ctx = { db: DemoDb | null; setDb: (fn: (d: DemoDb) => DemoDb) => void; reset: () => void };
const DemoCtx = createContext<Ctx>({ db: null, setDb: () => {}, reset: () => {} });

export function DemoProvider({ children }: { children: ReactNode }) {
  const { courses, loading } = useCourses();
  const [db, setState] = useState<DemoDb | null>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoDb) : null;
  });
  useEffect(() => {
    if (!db && !loading && courses.length) setState(buildSeed(courses));
  }, [db, loading, courses]);
  useEffect(() => {
    if (db) localStorage.setItem(KEY, JSON.stringify(db));
  }, [db]);
  const setDb = useCallback((fn: (d: DemoDb) => DemoDb) => setState((d) => (d ? fn(d) : d)), []);
  const reset = () => { localStorage.removeItem(KEY); setState(courses.length ? buildSeed(courses) : null); };
  return <DemoCtx.Provider value={{ db, setDb, reset }}>{children}</DemoCtx.Provider>;
}

// Published courses for the public site, managed from Admin → Course Management.
export function usePublicCourses() {
  const { db } = useContext(DemoCtx);
  const courses = (db?.courses ?? []).filter((c) => c.status === 'published').map((c) => ({ ...c, imageUrl: c.image }));
  return { courses, loading: !db };
}

export const seatsTaken = (db: DemoDb, sessionId: string) =>
  db.bookings.filter((b) => b.sessionId === sessionId && b.status !== 'cancelled')
    .reduce((n, b) => n + b.participants.filter((p) => p.status === 'registered').length, 0);

export const fmtSchedule = (s: CourseSession) =>
  s.dates.map((d) => `${format(parseDate(d.date), 'EEE, MMM d, yyyy')} · ${d.start}–${d.end}`).join('\n');

export function renderTemplate(text: string, db: DemoDb, b?: Booking) {
  if (!b) return text.replace(/{{customerName}}/g, 'there');
  const s = db.sessions.find((x) => x.id === b.sessionId);
  const vals: Record<string, string> = {
    customerName: b.contact.name, bookingRef: b.ref, courseName: db.courses.find((c) => c.id === b.courseId)?.name ?? '',
    mainCity: db.cities.find((c) => c.id === b.cityId)?.name ?? '', subCity: db.subCities.find((c) => c.id === b.subCityId)?.name ?? '',
    schedule: s ? fmtSchedule(s) : '', total: `$${b.total.toFixed(2)}`, status: b.status,
  };
  return text.replace(/{{(\w+)}}/g, (_, k) => vals[k] ?? '');
}

export function promoCheck(p: Promo | undefined, courseId: string, subtotal: number) {
  const today = format(new Date(), 'yyyy-MM-dd');
  if (!p || !p.active) return { error: 'This promo code is not valid.' };
  if (p.start > today) return { error: 'This promo code is not active yet.' };
  if (p.end < today) return { error: 'This promo code has expired.' };
  if (p.limit && p.used >= p.limit) return { error: 'This promo code has reached its usage limit.' };
  if (p.courseIds.length && !p.courseIds.includes(courseId)) return { error: 'This promo code does not apply to this course.' };
  const discount = Math.min(subtotal, p.type === 'percent' ? (subtotal * p.value) / 100 : p.value);
  return { promo: p, discount: Math.round(discount * 100) / 100 };
}

export function useDemo() {
  const { db, setDb, reset } = useContext(DemoCtx);
  const now = () => new Date().toISOString();

  const logEmails = (d: DemoDb, to: string[], subject: string, type: string): DemoDb => ({
    ...d, emails: [...to.map((t) => ({ id: uid(), to: t, subject, type, sentAt: now(), status: 'demo (not sent)' as const })), ...d.emails],
  });

  return {
    db, setDb, reset,
    async getAvailability(courseId: string, subCityId: string) {
      await wait();
      return db!.sessions.filter((s) => s.courseId === courseId && s.subCityId === subCityId && s.status === 'scheduled');
    },
    async validatePromo(code: string, courseId: string, subtotal: number) {
      await wait(350);
      return promoCheck(db!.promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase()), courseId, subtotal);
    },
    async createPendingBooking(input: Omit<Booking, 'id' | 'ref' | 'status' | 'paymentStatus' | 'createdAt' | 'audit'>, existingId?: string) {
      await wait();
      if (existingId) return existingId; // retry: reuse the same pending booking, never duplicate
      const id = uid();
      setDb((d) => ({ ...d, bookings: [{ ...input, id, ref: makeRef(), status: 'pending', paymentStatus: 'pending', createdAt: now(), audit: [{ at: now(), note: 'Booking created (awaiting payment)' }] }, ...d.bookings] }));
      return id;
    },
    async processPayment(bookingId: string, outcome: 'success' | 'failure') {
      await wait(1200);
      setDb((d) => {
        const b = d.bookings.find((x) => x.id === bookingId)!;
        if (outcome === 'failure') {
          return { ...d, bookings: d.bookings.map((x) => x.id === bookingId ? { ...x, paymentStatus: 'failed', audit: [...x.audit, { at: now(), note: 'Payment failed (demo)' }] } : x) };
        }
        const confirmed: Booking = { ...b, paymentStatus: 'paid', status: 'confirmed', audit: [...b.audit, { at: now(), note: 'Payment verified, booking confirmed (demo)' }] };
        let next: DemoDb = { ...d, bookings: d.bookings.map((x) => (x.id === bookingId ? confirmed : x)),
          promos: d.promos.map((p) => (p.code === b.promoCode ? { ...p, used: p.used + 1 } : p)) };
        const tpl = d.templates.find((t) => t.key === 'confirmation')!;
        if (tpl.automated) next = logEmails(next, [b.contact.email], renderTemplate(tpl.subject, next, confirmed), 'Booking Confirmation');
        return next;
      });
      return outcome === 'success';
    },
    cancelBooking(id: string) {
      setDb((d) => {
        const b = d.bookings.find((x) => x.id === id)!;
        let next: DemoDb = { ...d, bookings: d.bookings.map((x) => x.id === id ? { ...x, status: 'cancelled', paymentStatus: x.paymentStatus === 'paid' ? 'refunded' : x.paymentStatus,
          participants: x.participants.map((p) => ({ ...p, status: 'cancelled' as const })), audit: [...x.audit, { at: now(), note: 'Booking cancelled by admin' }] } : x) };
        const tpl = d.templates.find((t) => t.key === 'cancellation')!;
        if (tpl.automated) next = logEmails(next, [b.contact.email], renderTemplate(tpl.subject, next, b), 'Booking Cancellation');
        return next;
      });
    },
    cancelParticipant(bookingId: string, idx: number) {
      setDb((d) => ({ ...d, bookings: d.bookings.map((b) => b.id !== bookingId ? b : {
        ...b, participants: b.participants.map((p, i) => (i === idx ? { ...p, status: 'cancelled' as const } : p)),
        audit: [...b.audit, { at: now(), note: `Participant ${b.participants[idx].name} cancelled by admin` }] }) }));
    },
    async sendEmail(to: string[], subject: string, type: string) {
      await wait(600);
      setDb((d) => logEmails(d, to, subject, type));
    },
  };
}
