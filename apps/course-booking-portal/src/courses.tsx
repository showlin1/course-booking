import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { listCourses, ListCoursesOutputType } from 'zitejs/api';

export type Course = ListCoursesOutputType['courses'][0];

const Ctx = createContext<{ courses: Course[]; loading: boolean }>({ courses: [], loading: true });

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listCourses({})
      .then((r) => setCourses(r.courses))
      .finally(() => setLoading(false));
  }, []);
  return <Ctx.Provider value={{ courses, loading }}>{children}</Ctx.Provider>;
}

export const useCourses = () => useContext(Ctx);

export const money = (n: number) => `$${n.toFixed(2)}`;

export function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
