import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format, startOfDay, startOfMonth } from 'date-fns';
import { CheckCircle2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import { LOCATIONS } from '../content';
import { money, parseDate, useCourses } from '../courses';
import BookingCalendar from '../components/BookingCalendar';
import BookingForm from '../components/BookingForm';

export type Slot = { location: string; venue: string };

export default function Book() {
  const { slug } = useParams();
  const { courses, loading } = useCourses();
  const course = courses.find((c) => c.slug === slug);
  const today = startOfDay(new Date());
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(startOfMonth(today));
  const [slot, setSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<'schedule' | 'details' | 'done'>('schedule');
  const [moreInfo, setMoreInfo] = useState(true);

  const range = useMemo(() => course && { start: parseDate(course.scheduleStart), end: parseDate(course.scheduleEnd) }, [course]);
  const isAvailable = (d: Date) => !!range && d >= today && d >= range.start && d <= range.end;
  const firstAvailable = range ? (range.start > today ? range.start : today <= range.end ? today : null) : null;

  if (loading) return <div className="mx-auto max-w-7xl p-8"><Skeleton className="h-[480px]" /></div>;
  if (!course) return <div className="p-16 text-center">Course not found. <Link to="/course" className="text-primary underline">Back to courses</Link></div>;

  const slots: Slot[] = LOCATIONS.filter((l) => filter === 'All' || l.name === filter).flatMap((l) => l.venues.map((venue) => ({ location: l.name, venue })));
  const avail = isAvailable(selected);
  const pick = (d: Date) => { setSelected(d); setSlot(null); };
  const jumpNext = () => { if (firstAvailable) { pick(firstAvailable); setMonth(startOfMonth(firstAvailable)); } };

  if (step === 'done') return <Done course={course.name} date={selected} slot={slot!} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Schedule your course</h1>
      <p className="mt-3 text-muted-foreground">See available dates and times, and book what works for you</p>
      <div className="mt-6 flex items-center gap-4 border-t pt-4 text-sm">
        <span className="text-muted-foreground">Filter by:</span>
        <Select value={filter} onValueChange={(v) => { setFilter(v); setSlot(null); }}>
          <SelectTrigger className="w-56 border-none bg-transparent shadow-none"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Location (All)</SelectItem>
            {LOCATIONS.map((l) => <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          {step === 'schedule' ? (
            <>
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-display text-xl font-bold">Select a date and time</h2>
                <span className="hidden text-sm text-muted-foreground sm:inline">Time zone: Eastern Standard Time (EST)</span>
              </div>
              <div className="mt-6 grid gap-10 md:grid-cols-2">
                <BookingCalendar month={month} setMonth={setMonth} selected={selected} onSelect={pick} isAvailable={isAvailable} />
                <div>
                  <p>Availability for {format(selected, 'EEEE, MMMM d')}</p>
                  {!avail ? (
                    <>
                      <p className="text-muted-foreground">No availability</p>
                      {firstAvailable && <Button className="mt-6 w-full sm:w-72" onClick={jumpNext}>Check Next Availability</Button>}
                    </>
                  ) : (
                    <div className="mt-4 max-h-[380px] space-y-2 overflow-y-auto pr-1">
                      {slots.map((s) => {
                        const on = slot?.venue === s.venue;
                        return (
                          <button key={s.venue} onClick={() => setSlot(s)} className={cn('w-full rounded border p-3 text-left transition', on ? 'border-primary bg-accent' : 'bg-card hover:border-primary/60')}>
                            <p className="text-sm font-semibold">{course.classTime}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{s.venue}, {s.location}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <BookingForm course={course} date={selected} slot={slot!} onBack={() => setStep('schedule')} onDone={() => setStep('done')} />
          )}
        </div>

        <aside>
          <h2 className="font-display border-b pb-3 text-xl font-bold">Course details</h2>
          <p className="mt-4">{course.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{money(course.price)}</p>
          <button onClick={() => setMoreInfo(!moreInfo)} className="mt-3 flex w-full items-center justify-between text-sm text-muted-foreground">
            {moreInfo ? 'Less details' : 'More details'} {moreInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {moreInfo && (
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>Course runs: {format(range!.start, 'MMM d, yyyy')} – {format(range!.end, 'MMM d, yyyy')}</p>
              <p>Class time: {course.classTime}</p>
              {avail && <p>Selected: {format(selected, 'EEE, MMM d, yyyy')}</p>}
              {slot && <p>{slot.venue}, {slot.location}</p>}
            </div>
          )}
          {step === 'schedule' && <Button className="mt-8 w-full" disabled={!slot || !avail} onClick={() => setStep('details')}>Next</Button>}
        </aside>
      </div>
    </div>
  );
}

function Done({ course, date, slot }: { course: string; date: Date; slot: Slot }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
      <h1 className="font-display mt-4 text-3xl font-bold">You're booked!</h1>
      <p className="mt-3 text-muted-foreground">{course}</p>
      <p className="mt-1 font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</p>
      <p className="text-muted-foreground">{slot.venue}, {slot.location}</p>
      <Button asChild className="mt-8"><Link to="/course">Back to courses</Link></Button>
    </div>
  );
}
