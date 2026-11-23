import { addDays, format, startOfDay } from 'date-fns';
import type { Course } from '../courses';
import { LOCATIONS } from '../content';
import type { Booking, DemoDb, EmailTemplate } from './types';

export const uid = () => Math.random().toString(36).slice(2, 10);
export const ymd = (d: Date) => format(d, 'yyyy-MM-dd');
export const makeRef = () => 'KL-' + Math.random().toString(36).slice(2, 8).toUpperCase();

const TEMPLATES: EmailTemplate[] = [
  { key: 'confirmation', name: 'Booking Confirmation', automated: true, subject: 'Your booking is confirmed – {{bookingRef}}',
    body: 'Hi {{customerName}},\n\nThank you for booking {{courseName}}.\n\nReference: {{bookingRef}}\nLocation: {{subCity}}, {{mainCity}}\nSchedule:\n{{schedule}}\n\nTotal paid: {{total}}\nStatus: {{status}}\n\nSee you in class!\nKanova Life' },
  { key: 'reminder', name: 'Course Reminder', automated: true, subject: 'Reminder: {{courseName}} is coming up',
    body: 'Hi {{customerName}},\n\nA friendly reminder that {{courseName}} starts soon.\n\n{{schedule}}\nLocation: {{subCity}}, {{mainCity}}\n\nPlease arrive 10 minutes early.\nKanova Life' },
  { key: 'cancellation', name: 'Booking Cancellation', automated: true, subject: 'Your booking {{bookingRef}} was cancelled',
    body: 'Hi {{customerName}},\n\nYour booking for {{courseName}} ({{bookingRef}}) has been cancelled. Reply to this email if you have any questions.\n\nKanova Life' },
  { key: 'schedule', name: 'Schedule Change', automated: true, subject: 'Schedule update for {{courseName}}',
    body: 'Hi {{customerName}},\n\nThe schedule for {{courseName}} has changed. Your updated schedule:\n\n{{schedule}}\n\nKanova Life' },
  { key: 'announcement', name: 'General Announcement', automated: false, subject: 'News from Kanova Life', body: 'Hi {{customerName}},\n\n\n\nKanova Life' },
];

export function buildSeed(dbCourses: Course[]): DemoDb {
  const cities = LOCATIONS.map((l, i) => ({ id: `city${i}`, name: l.name, status: 'active' as const }));
  const subCities = LOCATIONS.flatMap((l, i) => l.venues.map((v, j) => ({ id: `sub${i}_${j}`, cityId: `city${i}`, name: v, address: '', status: 'active' as const })));
  const courses = dbCourses.map((c) => {
    const multi = /standard/i.test(c.name) && !/recert|blended/i.test(c.name);
    return {
      id: c.id, slug: c.slug, name: c.name, image: c.imageUrl ?? '', price: c.price,
      category: /basic life|bls/i.test(c.name) ? 'BLS' : /cpr/i.test(c.name) && !/first aid/i.test(c.name) ? 'CPR' : 'First Aid',
      description: `Canadian Red Cross ${c.name}. Hands-on, certified training with experienced instructors.`,
      duration: multi ? '2 days' : '1 day', sessionsCount: multi ? 2 : 1,
      objectives: 'Recognize and respond to emergencies\nPerform CPR and use an AED\nProvide first aid care', requirements: 'Comfortable clothing\nBring lunch and water',
      status: 'published' as const,
    };
  });

  const today = startOfDay(new Date());
  const sessions = courses.flatMap((c, ci) =>
    subCities.flatMap((s, si) =>
      [0, 1, 2, 3, 4, 5].map((k) => {
        const first = addDays(today, 3 + ((ci * 3 + si * 2 + k * 11) % 90));
        return {
          id: uid(), courseId: c.id, cityId: s.cityId, subCityId: s.id, capacity: 12, status: 'scheduled' as const,
          dates: Array.from({ length: c.sessionsCount }, (_, n) => ({ date: ymd(addDays(first, n)), start: '09:00', end: '17:00' })),
        };
      }),
    ),
  );

  const names = ['Sarah Mitchell', 'James Cooper', 'Priya Patel', 'Liam Bergeron', 'Emma Johnson', 'Noah Fiddler', 'Olivia Martin', 'Ethan Clarke'];
  const bookings: Booking[] = names.map((n, i) => {
    const s = sessions[(i * 37) % sessions.length];
    const c = courses.find((x) => x.id === s.courseId)!;
    const email = n.toLowerCase().replace(' ', '.') + '@example.com';
    const status = i === 6 ? 'cancelled' : i === 7 ? 'pending' : 'confirmed';
    return {
      id: uid(), ref: makeRef(), sessionId: s.id, courseId: c.id, cityId: s.cityId, subCityId: s.subCityId,
      contact: { name: n, email, phone: '807-555-01' + (10 + i) },
      participants: [{ name: n, email, status: status === 'cancelled' ? 'cancelled' : 'registered' }],
      subtotal: c.price, discount: 0, total: c.price,
      paymentStatus: status === 'confirmed' ? 'paid' : status === 'pending' ? 'pending' : 'refunded', status,
      createdAt: addDays(today, -i - 1).toISOString(), audit: [{ at: addDays(today, -i - 1).toISOString(), note: 'Demo booking created' }],
    };
  });

  return {
    seeded: true, courses, cities, subCities, sessions, bookings,
    promos: [
      { id: uid(), code: 'WELCOME10', type: 'percent', value: 10, courseIds: [], start: ymd(addDays(today, -30)), end: ymd(addDays(today, 90)), limit: 100, used: 4, active: true },
      { id: uid(), code: 'SAVE20', type: 'fixed', value: 20, courseIds: courses.slice(0, 2).map((c) => c.id), start: ymd(addDays(today, -30)), end: ymd(addDays(today, 60)), limit: 25, used: 3, active: true },
      { id: uid(), code: 'EXPIRED5', type: 'percent', value: 5, courseIds: [], start: ymd(addDays(today, -90)), end: ymd(addDays(today, -1)), limit: 0, used: 12, active: true },
    ],
    templates: TEMPLATES, emails: [],
    settings: { businessName: 'Kanova Life', replyTo: 'info@kanovalife.ca', reminderDaysBefore: 2 },
  };
}
