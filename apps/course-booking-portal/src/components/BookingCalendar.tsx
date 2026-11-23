import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfDay, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@project/components/lib/utils';

type Props = {
  month: Date;
  setMonth: (d: Date) => void;
  selected: Date;
  onSelect: (d: Date) => void;
  isAvailable: (d: Date) => boolean;
  strict?: boolean; // disable every day that isn't available
};

export default function BookingCalendar({ month, setMonth, selected, onSelect, isAvailable, strict }: Props) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const lead = getDay(days[0]);
  const today = startOfDay(new Date());
  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-6">
        <button aria-label="Previous month" disabled={isSameMonth(month, today)} onClick={() => setMonth(addMonths(month, -1))} className="rounded p-1 hover:bg-muted disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="w-40 text-center font-medium">{format(month, 'MMMM yyyy')}</span>
        <button aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))} className="rounded p-1 hover:bg-muted">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2 text-sm text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: lead }).map((_, i) => <div key={`e${i}`} />)}
        {days.map((d) => {
          const avail = isAvailable(d);
          const sel = isSameDay(d, selected);
          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelect(d)}
              disabled={d < today || (!!strict && !avail)}
              className={cn(
                'relative mx-auto grid h-10 w-10 place-items-center rounded text-sm transition',
                sel && avail ? 'bg-primary font-semibold text-primary-foreground' : avail ? 'font-semibold hover:bg-accent' : 'text-muted-foreground/50',
              )}
            >
              {format(d, 'd')}
              {avail && !sel && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
