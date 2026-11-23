import { format } from 'date-fns';
import { parseDate, money } from '../../courses';
import { useDemo } from '../../demo/store';
import type { DemoCourse } from '../../demo/types';

type Props = { course: DemoCourse; cityId: string; subCityId: string; sessionId: string; count: number; discount: number; promoCode?: string };

export default function SummaryCard({ course, cityId, subCityId, sessionId, count, discount, promoCode }: Props) {
  const { db } = useDemo();
  const s = db!.sessions.find((x) => x.id === sessionId);
  const subtotal = course.price * count;
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>
  );
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-display text-lg font-bold">Booking summary</h3>
      <div className="mt-3 divide-y">
        <div className="pb-2">
          <Row k="Course" v={course.name} />
          <Row k="Main City" v={db!.cities.find((c) => c.id === cityId)?.name ?? '—'} />
          <Row k="Sub-City" v={db!.subCities.find((c) => c.id === subCityId)?.name ?? '—'} />
          {s && <Row k="Course Date" v={format(parseDate(s.dates[0].date), 'EEE, MMM d, yyyy')} />}
          {s && <Row k="Time" v={`${s.dates[0].start} – ${s.dates[0].end}`} />}
          {s && s.dates.length > 1 && (
            <div className="py-1.5 text-sm">
              <p className="text-muted-foreground">All included sessions</p>
              {s.dates.map((d) => <p key={d.date} className="text-right font-medium">{format(parseDate(d.date), 'EEE, MMM d')} · {d.start}–{d.end}</p>)}
            </div>
          )}
          <Row k="Participants" v={String(count)} />
          <Row k="Course Price" v={money(course.price)} />
        </div>
        <div className="pt-2">
          <Row k="Original Price" v={money(subtotal)} />
          {discount > 0 && <Row k={`Discount${promoCode ? ` (${promoCode})` : ''}`} v={`− ${money(discount)}`} />}
          <div className="mt-2 flex justify-between border-t pt-3 font-display text-lg font-extrabold"><span>Total</span><span className="text-primary">{money(subtotal - discount)}</span></div>
        </div>
      </div>
    </div>
  );
}
