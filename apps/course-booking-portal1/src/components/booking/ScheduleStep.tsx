import { useEffect, useMemo, useState } from 'react';
import { format, startOfMonth } from 'date-fns';
import { Clock, Loader2, MapPin, Users } from 'lucide-react';
import { Label } from '@project/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { cn } from '@project/components/lib/utils';
import BookingCalendar from '../BookingCalendar';
import { parseDate } from '../../courses';
import { seatsTaken, useDemo } from '../../demo/store';
import type { CourseSession } from '../../demo/types';

type Props = {
  courseId: string;
  cityId: string; subCityId: string; sessionId: string;
  onChange: (p: { cityId?: string; subCityId?: string; sessionId?: string }) => void;
};

export default function ScheduleStep({ courseId, cityId, subCityId, sessionId, onChange }: Props) {
  const { db, getAvailability } = useDemo();
  const [sessions, setSessions] = useState<CourseSession[] | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!subCityId) return setSessions(null);
    setSessions(null);
    getAvailability(courseId, subCityId).then((s) => {
      const open = s.filter((x) => x.dates[0].date >= today);
      setSessions(open);
      const first = open.map((x) => x.dates[0].date).sort()[0];
      if (first) setMonth(startOfMonth(parseDate(first)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, subCityId]);

  const left = (s: CourseSession) => s.capacity - seatsTaken(db!, s.id);
  const byDay = useMemo(() => {
    const m = new Map<string, CourseSession[]>();
    (sessions ?? []).filter((s) => left(s) > 0).forEach((s) => m.set(s.dates[0].date, [...(m.get(s.dates[0].date) ?? []), s]));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, db]);

  const cities = db!.cities.filter((c) => c.status === 'active');
  const subs = db!.subCities.filter((s) => s.cityId === cityId && s.status === 'active');
  const daySessions = day ? byDay.get(format(day, 'yyyy-MM-dd')) ?? [] : [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Main City *</Label>
          <Select value={cityId || undefined} onValueChange={(v) => { setDay(null); onChange({ cityId: v, subCityId: '', sessionId: '' }); }}>
            <SelectTrigger><SelectValue placeholder="Select Main City" /></SelectTrigger>
            <SelectContent>{cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Sub-City / Training Location *</Label>
          <Select disabled={!cityId} value={subCityId || undefined} onValueChange={(v) => { setDay(null); onChange({ subCityId: v, sessionId: '' }); }}>
            <SelectTrigger><SelectValue placeholder={cityId ? 'Select Sub-City' : 'Select a main city first'} /></SelectTrigger>
            <SelectContent>{subs.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {!subCityId ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          <MapPin className="mx-auto mb-2 h-6 w-6" />Choose your city and training location to see available dates.
        </div>
      ) : sessions === null ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border p-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Checking availability…</div>
      ) : byDay.size === 0 ? (
        <div className="rounded-xl border bg-accent/40 p-10 text-center text-sm">No available sessions were found for your selected location. Please choose another location or check again later.</div>
      ) : (
        <div className="grid gap-8 rounded-xl border bg-card p-5 md:grid-cols-2 md:p-6">
          <BookingCalendar strict month={month} setMonth={setMonth}
            selected={day ?? new Date(0)} onSelect={(d) => { setDay(d); onChange({ sessionId: '' }); }} isAvailable={(d) => byDay.has(format(d, 'yyyy-MM-dd'))} />
          <div>
            <p className="font-display font-bold">{day ? format(day, 'EEEE, MMMM d') : 'Select a highlighted date'}</p>
            <div className="mt-4 space-y-3">
              {daySessions.map((s) => (
                <button key={s.id} onClick={() => onChange({ sessionId: s.id })}
                  className={cn('w-full rounded-lg border p-4 text-left transition', s.id === sessionId ? 'border-primary bg-accent ring-1 ring-primary' : 'hover:border-primary/60')}>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{s.dates[0].start} – {s.dates[0].end}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" />{left(s)} seats left</span>
                  </div>
                  {s.dates.length > 1 && (
                    <div className="mt-3 border-t pt-2 text-xs text-muted-foreground">
                      <p className="mb-1 font-semibold text-foreground">{s.dates.length} mandatory sessions included:</p>
                      {s.dates.map((d) => <p key={d.date}>{format(parseDate(d.date), 'EEE, MMM d')} · {d.start}–{d.end}</p>)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
