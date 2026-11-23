import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Check, CreditCard, Loader2, Lock } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import { money } from '../courses';
import { seatsTaken, useDemo } from '../demo/store';
import ScheduleStep from '../components/booking/ScheduleStep';
import SummaryCard from '../components/booking/SummaryCard';
import DetailsStep, { AppliedPromo, Details } from '../components/booking/DetailsStep';

const STEPS = ['Date & Location', 'Summary', 'Participants', 'Checkout'];

export default function Book() {
  const { slug } = useParams();
  const nav = useNavigate();
  const demo = useDemo();
  const { db } = demo;
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({ cityId: '', subCityId: '', sessionId: '' });
  const [d, setD] = useState<Details>({ name: '', email: '', phone: '', count: 1, extra: [] });
  const [promo, setPromo] = useState<AppliedPromo>(null);
  const [bookingId, setBookingId] = useState<string>();
  const [paying, setPaying] = useState<'idle' | 'creating' | 'gateway' | 'processing'>('idle');
  const [payError, setPayError] = useState('');

  if (!db) return <div className="mx-auto max-w-7xl p-8"><Skeleton className="h-[480px]" /></div>;
  const course = db.courses.find((c) => c.slug === slug && c.status === 'published');
  if (!course) return <div className="p-16 text-center">Course not found. <Link to="/course" className="text-primary underline">Back to courses</Link></div>;

  const session = db.sessions.find((s) => s.id === sel.sessionId);
  const seats = session ? session.capacity - seatsTaken(db, session.id) : 1;
  const subtotal = course.price * d.count;
  const discount = promo?.discount ?? 0;

  const pay = async () => {
    setPayError(''); setPaying('creating');
    const id = await demo.createPendingBooking({
      sessionId: sel.sessionId, courseId: course.id, cityId: sel.cityId, subCityId: sel.subCityId,
      contact: { name: d.name, email: d.email, phone: d.phone },
      participants: [{ name: d.name, email: d.email, phone: d.phone, status: 'registered' }, ...d.extra.map((p) => ({ ...p, status: 'registered' as const }))],
      subtotal, discount, total: subtotal - discount, promoCode: promo?.code,
    }, bookingId);
    setBookingId(id); setPaying('gateway');
  };
  const finish = async (outcome: 'success' | 'failure') => {
    setPaying('processing');
    const ok = await demo.processPayment(bookingId!, outcome);
    if (ok) nav(`/booking-confirmation?id=${bookingId}`);
    else { setPaying('idle'); setPayError('Your payment could not be completed. No charge was made — please try again.'); }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Book your course</h1>
      <ol className="mt-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className={cn('flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold', i === step ? 'border-primary bg-primary text-primary-foreground' : i < step ? 'border-primary/40 text-primary' : 'text-muted-foreground')}>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-background/20">{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>{s}
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && <>
            <ScheduleStep courseId={course.id} {...sel} onChange={(p) => setSel((s) => ({ ...s, ...p }))} />
            <div className="mt-6 flex justify-end"><Button disabled={!sel.sessionId} onClick={() => setStep(1)}>Continue</Button></div>
          </>}
          {step === 1 && <>
            <SummaryCard course={course} {...sel} count={d.count} discount={discount} promoCode={promo?.code} />
            <div className="mt-6 flex justify-between"><Button variant="outline" onClick={() => setStep(0)}>Back</Button><Button onClick={() => setStep(2)}>Continue to Checkout</Button></div>
          </>}
          {step === 2 && <DetailsStep d={d} set={setD} maxCount={Math.min(10, seats)} courseId={course.id} subtotal={subtotal} promo={promo} setPromo={setPromo} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-display text-lg font-bold">Participant details</h3>
                <p className="mt-2 text-sm">{d.name} · {d.email} · {d.phone}</p>
                {d.extra.map((p, i) => <p key={i} className="text-sm text-muted-foreground">Participant {i + 2}: {p.name}{p.email && ` · ${p.email}`}</p>)}
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Lock className="h-4 w-4 text-primary" />Secure payment</h3>
                <p className="mt-2 text-sm text-muted-foreground">Card details are entered on the payment provider's secure page — never on this site.</p>
                {payError && <p className="mt-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{payError}</p>}
                {paying === 'gateway' || paying === 'processing' ? (
                  <div className="mt-5 rounded-lg border-2 border-dashed border-primary/40 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Demo payment — not connected</p>
                    <p className="mt-1 text-sm text-muted-foreground">A real payment provider will appear here once checkout is connected. Simulate an outcome:</p>
                    {paying === 'processing' ? <p className="mt-4 flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Verifying payment…</p> : (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button onClick={() => finish('success')}>Simulate successful payment</Button>
                        <Button variant="outline" onClick={() => finish('failure')}>Simulate failed payment</Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-5 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)} disabled={paying !== 'idle'}>Back</Button>
                    <Button size="lg" onClick={pay} disabled={paying !== 'idle'}>
                      {paying === 'creating' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                      {payError ? 'Retry Payment' : `Confirm & Pay ${money(subtotal - discount)}`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-xl border bg-card">
            {course.image && <img src={course.image} alt="" className="aspect-video w-full object-cover" />}
            <div className="p-5">
              <h2 className="font-display text-lg font-bold leading-snug">{course.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{course.duration}{course.sessionsCount > 1 && ` · ${course.sessionsCount} sessions`}</p>
              <p className="mt-3 text-sm text-muted-foreground">{course.description}</p>
              <p className="mt-4 font-display text-2xl font-extrabold text-primary">{money(course.price)}</p>
            </div>
          </div>
          {step >= 2 && <SummaryCard course={course} {...sel} count={d.count} discount={discount} promoCode={promo?.code} />}
        </aside>
      </div>
    </div>
  );
}
