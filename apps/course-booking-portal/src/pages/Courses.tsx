import { Link } from 'react-router-dom';
import { Button } from '@project/components/ui/button';
import { HERO_IMAGE } from '../content';
import CourseGrid from '../components/CourseGrid';

export default function Courses() {
  return (
    <>
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Master Life-Saving Skills</h1>
          <p className="mt-4 max-w-xl text-lg opacity-85">Certified Canadian Red Cross courses designed for workplaces and individuals.</p>
          <Button size="lg" className="mt-8" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>Explore Courses</Button>
        </div>
      </section>
      <section id="courses" className="mx-auto max-w-7xl px-4 pt-16 md:px-8"><CourseGrid /></section>
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="rounded-xl bg-accent p-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">PRIVATE BOOKINGS</p>
          <h2 className="font-display mt-3 text-3xl font-bold">Custom Training for Your Team</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">We bring certified training to your site in Northern Ontario. Flexible scheduling for groups of all sizes.</p>
          <Button asChild size="lg" className="mt-6"><Link to="/locations">Inquire for Groups</Link></Button>
        </div>
      </section>
    </>
  );
}
