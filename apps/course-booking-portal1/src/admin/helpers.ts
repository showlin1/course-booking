import { format } from 'date-fns';
import { parseDate } from '../courses';
import type { Booking, DemoDb } from '../demo/types';

export const courseName = (db: DemoDb, id: string) => db.courses.find((c) => c.id === id)?.name ?? '—';
export const cityName = (db: DemoDb, id: string) => db.cities.find((c) => c.id === id)?.name ?? '—';
export const subName = (db: DemoDb, id: string) => db.subCities.find((c) => c.id === id)?.name ?? '—';
export const sessionDate = (db: DemoDb, sessionId: string) => {
  const s = db.sessions.find((x) => x.id === sessionId);
  return s ? s.dates[0].date : '';
};
export const fmtD = (ymd: string) => (ymd ? format(parseDate(ymd), 'MMM d, yyyy') : '—');
export const fmtDT = (iso: string) => format(new Date(iso), 'MMM d, yyyy');
export const usd = (n: number) => `$${n.toFixed(2)}`;

export type ParticipantRow = { b: Booking; idx: number; name: string; email: string; phone: string; status: string };
export const participantRows = (db: DemoDb): ParticipantRow[] =>
  db.bookings.flatMap((b) => b.participants.map((p, idx) => ({ b, idx, name: p.name, email: p.email, phone: p.phone ?? (idx === 0 ? b.contact.phone : ''), status: p.status })));
