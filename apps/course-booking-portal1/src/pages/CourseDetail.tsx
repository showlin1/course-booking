import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';
import { COMPLETION, DETAIL_IMAGES, HIGHLIGHTS, LEARN } from '../content';
import { money } from '../courses';
import { usePublicCourses } from '../demo/store';

export default function CourseDetail() {
  const { slug } = useParams();
  const { courses, loading } = usePublicCourses();
  const c = courses.find((x) => x.slug === slug);
  if (loading) return <div className="mx-auto max-w-7xl p-8"><Skeleton className="h-96" /></div>;
  if (!c) return <div className="p-16 text-center">Course not found. <Link to="/course" className="text-primary underline">Back to courses</Link></div>;
  const book = `/book/${c.slug}`;
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-8 md:py-16">
        <img src={c.imageUrl} alt={c.name} className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg" />
        <div className="flex flex-col justify-center">
          <Link to="/course" className="text-sm text-muted-foreground hover:text-primary">← All courses</Link>
          <h1 className="font-display mt-3 text-3xl font-bold leading-tight md:text-4xl">{c.name}</h1>
          <p className="mt-5 text-sm font-semibold">Now Serving :</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Thunder Bay', 'Nipigon', 'Terrace Bay'].map((l) => (
              <span key={l} className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-sm"><MapPin className="h-3.5 w-3.5 text-primary" />{l}</span>
            ))}
          </div>
          {c.description && <p className="mt-5 text-muted-foreground">{c.description}</p>}
          <p className="mt-2 text-sm text-muted-foreground">{c.duration}{c.sessionsCount > 1 && ` · ${c.sessionsCount} sessions`}</p>
          <p className="mt-6 text-3xl font-bold text-primary">{money(c.price)}</p>
          <Button asChild size="lg" className="mt-6 w-full sm:w-auto"><Link to={book}>Browse Date &amp; Time</Link></Button>
        </div>
      </section>

      <section className="bg-muted/60 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-display text-3xl font-bold">Course Highlights</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map(([t, d], i) => (
              <div key={t} className="overflow-hidden rounded-lg border bg-card shadow-sm">
                <img src={DETAIL_IMAGES[i]} alt="" className="aspect-video w-full object-cover" />
                <div className="p-5"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-3 md:px-8">
        <div className="space-y-8 md:col-span-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Prerequisites</h2>
            <p className="mt-3 text-muted-foreground">No previous first aid training is required. This course is suitable for first-time learners as well as individuals who want to develop practical emergency response skills for work or everyday life.</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">What Will You Learn?</h2>
            <p className="mt-3 text-muted-foreground">The Canadian Red Cross Intermediate First Aid with CPR/AED Level C course covers essential emergency response knowledge and practical first aid skills, including:</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {LEARN.map((l) => <li key={l} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 translate-y-0.5 text-primary" />{l}</li>)}
            </ul>
            <p className="mt-4 text-muted-foreground">Participants will have opportunities to practise their skills and demonstrate their ability to respond appropriately to common emergency situations.</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Certification &amp; Completion</h2>
            <h3 className="mt-4 font-semibold">Course Completion Requirements</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{COMPLETION.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="mt-3 text-sm text-muted-foreground">Full attendance and successful completion of the required assessments are necessary for certification.</p>
            <h3 className="mt-6 font-semibold">Certification</h3>
            <p className="mt-2 text-sm text-muted-foreground">Successful participants receive a Canadian Red Cross Intermediate First Aid with CPR/AED Level C certification, subject to meeting all course completion requirements.</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><b>Certification validity:</b> Three years, subject to Canadian Red Cross certification terms</li>
              <li><b>Recognition:</b> Canadian Red Cross certification accepted by many employers across Canada, subject to individual workplace requirements</li>
            </ul>
            <p className="mt-3 text-sm italic text-muted-foreground">Always confirm with your employer or applicable regulatory authority that this course meets the specific first aid certification requirements for your position.</p>
          </div>
        </div>
        <aside className="h-fit rounded-lg border bg-card p-6 shadow-md md:sticky md:top-24">
          <h3 className="font-display text-xl font-bold">Blended Program</h3>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>Online learning: 4–6 hours</li>
            <li>In-person classroom training: 8 hours</li>
            <li>validity: Three years, subject to Canadian Red Cross certification terms</li>
          </ul>
          <p className="mt-5 text-2xl font-bold text-primary">{money(c.price)}</p>
          <Button asChild className="mt-4 w-full" size="lg"><Link to={book}>Register Now</Link></Button>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="rounded-xl bg-secondary p-10 text-center text-secondary-foreground">
          <h2 className="font-display text-3xl font-bold">Register for Intermediate First Aid in Northern Ontario</h2>
          <p className="mx-auto mt-4 max-w-2xl opacity-80">Prepare yourself to respond to emergencies with Canadian Red Cross Intermediate First Aid CPR/AED Level C training from Kanova Life Safety &amp; Training.</p>
          <p className="mx-auto mt-2 max-w-2xl opacity-80">Whether you are an individual looking to expand your skills or an employer arranging training for your team, we can help you explore available courses and training options.</p>
          <Button asChild size="lg" className="mt-6"><Link to={book}>Browse Dates &amp; Location</Link></Button>
        </div>
      </section>
    </>
  );
}
