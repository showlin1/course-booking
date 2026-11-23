import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { money, parseDate } from '../courses';
import { useDemo } from '../demo/store';

export default function BookingConfirmation() {
  const [params] = useSearchParams();
  const { db } = useDemo();
  const b = db?.bookings.find((x) => x.id === params.get('id'));
  if (!db) return null;
  if (!b || b.paymentStatus !== 'paid') return (
    <div className="p-16 text-center">We couldn't find a confirmed booking. <Link to="/course" className="text-primary underline">Back to courses</Link></div>
  );
  const s = db.sessions.find((x) => x.id === b.sessionId)!;
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => <div className="flex justify-between gap-4 border-b py-3 text-sm last:border-0"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="font-display mt-4 text-3xl font-extrabold md:text-4xl">Booking successful!</h1>
        <p className="mt-2 text-muted-foreground">Your booking reference is</p>
        <p className="mt-1 font-display text-2xl font-extrabold tracking-wider">{b.ref}</p>
      </div>
      <div className="mt-10 rounded-xl border bg-card px-6 py-2">
        <Row k="Course" v={db.courses.find((c) => c.id === b.courseId)?.name} />
        <Row k="Main City" v={db.cities.find((c) => c.id === b.cityId)?.name} />
        <Row k="Sub-City" v={db.subCities.find((c) => c.id === b.subCityId)?.name} />
        <Row k="Schedule" v={s.dates.map((d) => <div key={d.date}>{format(parseDate(d.date), 'EEE, MMM d, yyyy')} · {d.start}–{d.end}</div>)} />
        <Row k="Participants" v={b.participants.map((p) => <div key={p.name}>{p.name}</div>)} />
        <Row k="Total Paid" v={money(b.total)} />
        <Row k="Payment Status" v={<span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">{b.paymentStatus}</span>} />
      </div>
      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />A confirmation email has been queued for {b.contact.email} (demo — not actually sent).</p>
      <div className="mt-8 text-center"><Button asChild size="lg"><Link to="/course">Back to Courses</Link></Button></div>
    </div>
  );
}
