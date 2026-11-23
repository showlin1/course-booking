import { Link } from 'react-router-dom';
import { Skeleton } from '@project/components/ui/skeleton';
import { money } from '../courses';
import { usePublicCourses } from '../demo/store';

export default function CourseGrid() {
  const { courses, loading } = usePublicCourses();
  return (
    <div>
      <h2 className="font-display text-3xl font-bold md:text-4xl">Our Courses</h2>
      <p className="mt-2 text-muted-foreground">Certified Canadian Red Cross first aid and CPR training across Norther Ontario.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
        {courses.map((c) => (
          <Link key={c.id} to={`/courses/${c.slug}`} className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold leading-snug">{c.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{money(c.price)}</span>
                <span className="text-sm font-medium underline-offset-4 group-hover:underline">Learn More →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
