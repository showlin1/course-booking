import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, CalendarCheck, MapPin, Quote, ShieldCheck, Star, Users } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@project/components/ui/accordion';
import { DETAIL_IMAGES, FAQ, HERO_IMAGE, LOCATIONS, TESTIMONIALS } from '../content';
import CourseGrid from '../components/CourseGrid';

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

function Eyebrow({ children }: { children: string }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{children}</p>;
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/20" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-8 md:pb-40 md:pt-32">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
          <ShieldCheck className="h-4 w-4 text-primary" /> Canadian Red Cross Training Partner
        </p>
        <h1 className="font-display mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] md:text-6xl">
          WSIB Approved First Aid Training in <span className="text-primary">Thunder Bay</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg opacity-80">As a Canadian Red Cross Training Partner, our first aid courses are WSIB approved in Ontario, so your certification meets workplace safety requirements with confidence.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild size="lg" className="h-12 px-7 text-base"><Link to="/course">Book a Course <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline" className="h-12 border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"><Link to="/locations">View Locations</Link></Button>
        </div>
      </motion.div>
    </section>
  );
}

const STATS = [
  { icon: Award, label: 'Red Cross Certified', sub: 'Valid for 3 years' },
  { icon: ShieldCheck, label: 'WSIB Approved', sub: 'Meets Ontario requirements' },
  { icon: MapPin, label: `${LOCATIONS.length} Communities`, sub: 'Thunder Bay & region' },
  { icon: CalendarCheck, label: 'Easy Online Booking', sub: 'Pick your date & time' },
];

function TrustBar() {
  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 md:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-xl md:grid-cols-4">
        {STATS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 bg-card p-5 md:p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Icon className="h-5 w-5" /></span>
            <div><p className="font-display text-sm font-bold md:text-base">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <motion.section {...fade} className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 md:grid-cols-2 md:px-8">
      <div className="relative">
        <img src={DETAIL_IMAGES[0]} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" />
        <div className="absolute -bottom-6 -right-2 rounded-xl bg-primary px-6 py-4 text-primary-foreground shadow-lg md:-right-6">
          <p className="font-display text-3xl font-extrabold">100%</p><p className="text-xs opacity-90">Hands-on practice</p>
        </div>
      </div>
      <div>
        <Eyebrow>About Us</Eyebrow>
        <h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">Life-Saving Skills for Everyone</h2>
        <p className="mt-4 text-lg text-muted-foreground">Empowering individuals and corporate teams with certified first aid training. Master essential life-saving skills in a professional, supportive environment.</p>
        <ul className="mt-6 space-y-3 text-sm">
          {['Certified, experienced instructors', 'Small classes with real equipment', 'Same-day certification on completion'].map((t) => (
            <li key={t} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" />{t}</li>
          ))}
        </ul>
        <Button asChild size="lg" className="mt-8">
          <Link to="/course">View Courses <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </motion.section>
  );
}

function Workplace() {
  return (
    <motion.section {...fade} className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
      <div className="grid overflow-hidden rounded-3xl bg-secondary text-secondary-foreground md:grid-cols-2">
        <div className="p-8 md:p-14">
          <Users className="h-8 w-8 text-primary" />
          <h2 className="font-display mt-4 text-3xl font-extrabold">Workplace Training Solutions</h2>
          <p className="mt-4 opacity-75">Empower your team with life-saving skills. We bring certified first aid and CPR training directly to your workplace in Thunder Bay, so your staff can learn together on-site.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/locations">Booking Inquiry</Link></Button>
        </div>
        <img src={DETAIL_IMAGES[1]} alt="" className="h-64 w-full object-cover md:h-full" />
      </div>
    </motion.section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
      <div className="text-center"><Eyebrow>Testimonials</Eyebrow><h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">What Our Participants Say</h2></div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map(([t, who]) => (
          <motion.figure {...fade} key={who} className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 text-primary">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <Quote className="h-6 w-6 text-primary/30" />
            </div>
            <blockquote className="mt-4 flex-1 leading-relaxed">{t}</blockquote>
            <figcaption className="font-display mt-6 border-t pt-4 text-sm font-bold">{who}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mx-auto mt-24 max-w-3xl px-4 md:px-8">
      <div className="text-center"><Eyebrow>FAQ</Eyebrow><h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">Frequently Asked Questions</h2></div>
      <Accordion type="single" collapsible className="mt-10 space-y-3">
        {FAQ.map(([q, a]) => (
          <AccordionItem key={q} value={q} className="rounded-xl border bg-card px-5">
            <AccordionTrigger className="font-display text-left text-base font-bold hover:no-underline">{q}</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="font-display max-w-2xl text-3xl font-extrabold md:text-4xl">Ready to get certified?</h2>
        <p className="max-w-xl opacity-90">Choose your course, pick a date that works for you, and reserve your seat in minutes.</p>
        <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base"><Link to="/course">Browse Courses</Link></Button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-2 text-center"><Eyebrow>Our Courses</Eyebrow></div>
        <CourseGrid />
      </section>
      <Workplace />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}
