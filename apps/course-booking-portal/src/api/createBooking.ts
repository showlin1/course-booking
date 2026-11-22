import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';

const VENUES: Record<string, string[]> = {
  'Thunder Bay': [
    'Current River Community Centre',
    'Vickers Heights Community Centre',
    'West Thunder Community Centre',
    'North End Community Centre',
  ],
  Nipigon: ['Nipigon Community Centre'],
  'Terrace Bay': ['Terrace Bay Community Centre'],
};

export default createEndpoint({
  description: 'Books a course session for a visitor',
  inputSchema: z.object({
    courseId: z.string(),
    location: z.string(),
    venue: z.string(),
    sessionDate: z.string(),
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    notes: z.string().optional(),
  }),
  outputSchema: z.object({ bookingId: z.string() }),
  execute: async ({ input }) => {
    if (!VENUES[input.location]?.includes(input.venue)) {
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'Invalid location', userFacingMessage: 'Please choose a valid location.' });
    }
    const course = await zite.courses.findOne({ id: input.courseId });
    if (!course) throw new ZiteError({ code: 'BAD_REQUEST', message: 'Course not found', userFacingMessage: 'Course not found.' });
    const d = input.sessionDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || d < (course.scheduleStart ?? '') || d > (course.scheduleEnd ?? '')) {
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'Date outside schedule', userFacingMessage: 'That date is not available for this course.' });
    }
    const rec = await zite.bookings.create({
      record: {
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        course: [course.id],
        location: input.location,
        venue: input.venue,
        sessionDate: d,
        price: course.price ?? 0,
        notes: input.notes,
        status: 'Pending',
      },
    });
    return { bookingId: rec.id };
  },
});
