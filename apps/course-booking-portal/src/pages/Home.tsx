import { Link } from 'react-router-dom';
import { ShieldCheck, Quote } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@project/components/ui/accordion';
import { DETAIL_IMAGES, FAQ, HERO_IMAGE, TESTIMONIALS } from '../content';
import CourseGrid from '../components/CourseGrid';

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            <ShieldCheck className="h-4 w-4" /> Canadian Red Cross Training Partner
          </p>
          <h1 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">WSIB Approved First Aid Training in Thunder Bay</h1>
          <p className="mt-6 max-w-2xl text-lg opacity-85">As a Canadian Red Cross Training Partner, our first aid courses are WSIB approved in Ontario, so your certification meets workplace safety requirements with confidence.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8">
        <img src={DETAIL_IMAGES[0]} alt="" className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg" />
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Life-Saving Skills for Everyone</h2>
          <p className="mt-4 text-lg text-muted-foreground">Empowering individuals and corporate teams with certified first aid training. Master essential life-saving skills in a professional, supportive environment.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/course">View Courses</Link></Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8"><CourseGrid /></section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-10 rounded-xl bg-accent p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-3xl font-bold">Workplace Training Solutions - Thunder Bay</h2>
            <p className="mt-4 text-muted-foreground">Empower your team with life-saving skills. We bring certified first aid and CPR training directly to your workplace in Thunder Bay, so your staff can learn together on-site.</p>
            <Button asChild size="lg" className="mt-6"><Link to="/course">Booking Inquiry</Link></Button>
          </div>
          <img src={DETAIL_IMAGES[1]} alt="" className="aspect-video w-full rounded-lg object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 md:px-8">
        <h2 className="font-display text-center text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mt-8">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
              <AccordionContent className="whitespace-pre-line text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-center text-3xl font-bold md:text-4xl">What Our Participants Say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(([t, who]) => (
            <figure key={who} className="rounded-lg border bg-card p-6 shadow-sm">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-3">{t}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">{who}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
