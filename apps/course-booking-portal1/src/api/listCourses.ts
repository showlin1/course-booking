import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

const course = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  scheduleStart: z.string(),
  scheduleEnd: z.string(),
  classTime: z.string(),
});

export default createEndpoint({
  description: 'Lists all courses with their price and schedule window',
  inputSchema: z.object({}),
  outputSchema: z.object({ courses: z.array(course) }),
  execute: async () => {
    const { records } = await zite.courses.findAll({ limit: 100 });
    const courses = records
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((r) => ({
        id: r.id,
        name: r.courseName ?? '',
        slug: r.slug ?? '',
        price: r.price ?? 0,
        imageUrl: r.imageUrl ?? '',
        scheduleStart: r.scheduleStart ?? '',
        scheduleEnd: r.scheduleEnd ?? '',
        classTime: r.classTime ?? '',
      }));
    return { courses };
  },
});
