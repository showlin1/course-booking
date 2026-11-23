import { useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, List, Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { seatsTaken, useDemo } from '../demo/store';
import { uid } from '../demo/seed';
import type { CourseSession } from '../demo/types';
import { Confirm, DataTable, Field, FilterSelect, PageHeader, StatusBadge, useFilters } from './ui';
import { cityName, courseName, fmtD, subName } from './helpers';

export default function ScheduleAdmin() {
  const { db, setDb, sendEmail } = useDemo();
  const [f, setF] = useFilters({ course: 'all', city: 'all', sub: 'all', status: 'all', from: '' });
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [edit, setEdit] = useState<CourseSession | null>(null);
  const d = db!;
  const list = d.sessions.filter((s) => (f.course === 'all' || s.courseId === f.course) && (f.city === 'all' || s.cityId === f.city) && (f.sub === 'all' || s.subCityId === f.sub)
    && (f.status === 'all' || s.status === f.status) && (!f.from || s.dates[0].date >= f.from)).sort((a, b) => a.dates[0].date.localeCompare(b.dates[0].date));

  const cancel = (s: CourseSession) => {
    setDb((x) => ({ ...x, sessions: x.sessions.map((y) => (y.id === s.id ? { ...y, status: 'cancelled' } : y)) }));
    const emails = d.bookings.filter((b) => b.sessionId === s.id && b.status !== 'cancelled').map((b) => b.contact.email);
    if (emails.length) sendEmail(emails, `Schedule update for ${courseName(d, s.courseId)}`, 'Schedule Change');
    toast.success(emails.length ? `Session cancelled — ${emails.length} customer(s) notified` : 'Session cancelled');
  };
  const remove = (s: CourseSession) => {
    if (seatsTaken(d, s.id) > 0) return toast.error('This session has bookings. Cancel or reschedule it instead of deleting.');
    setDb((x) => ({ ...x, sessions: x.sessions.filter((y) => y.id !== s.id) })); toast.success('Session removed');
  };
  const newSession = (): CourseSession => {
    const c = d.courses[0];
    return { id: '', courseId: c.id, cityId: d.cities[0].id, subCityId: d.subCities.find((s) => s.cityId === d.cities[0].id)?.id ?? '', capacity: 12, status: 'scheduled',
      dates: Array.from({ length: c.sessionsCount }, () => ({ date: '', start: '09:00', end: '17:00' })) };
  };

  return (
    <>
      <PageHeader title="Course Calendar & Scheduling" sub="Changes here update what customers can book"
        actions={<>
          <Button variant="outline" onClick={() => setView(view === 'table' ? 'calendar' : 'table')}>{view === 'table' ? <><CalendarDays className="mr-1 h-4 w-4" />Calendar view</> : <><List className="mr-1 h-4 w-4" />Table view</>}</Button>
          <Button onClick={() => setEdit(newSession())}><Plus className="mr-1 h-4 w-4" />Add Course Date</Button></>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterSelect value={f.course} onChange={(v) => setF('course', v)} all="All courses" options={d.courses.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.city} onChange={(v) => { setF('city', v); setF('sub', 'all'); }} all="All cities" options={d.cities.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.sub} onChange={(v) => setF('sub', v)} all="All sub-cities" options={d.subCities.filter((s) => f.city === 'all' || s.cityId === f.city).map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.status} onChange={(v) => setF('status', v)} all="Any status" options={[{ value: 'scheduled', label: 'Scheduled' }, { value: 'cancelled', label: 'Cancelled' }]} />
        <Input type="date" value={f.from} onChange={(e) => setF('from', e.target.value)} className="w-full sm:w-44" aria-label="From date" />
      </div>
      {view === 'calendar' ? <MonthView sessions={list} onPick={setEdit} /> : (
        <DataTable head={['Date(s)', 'Time', 'Course', 'Main City', 'Sub-City', 'Booked / Capacity', 'Status', 'Actions']} empty="No sessions match these filters."
          rows={list.map((s) => [
            s.dates.map((x) => fmtD(x.date)).join(' + '), `${s.dates[0].start}–${s.dates[0].end}`, courseName(d, s.courseId), cityName(d, s.cityId), subName(d, s.subCityId),
            `${seatsTaken(d, s.id)} / ${s.capacity}`, <StatusBadge s={s.status} />,
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setEdit(s)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
              {s.status === 'scheduled' && <Confirm trigger={<Button size="sm" variant="ghost" aria-label="Cancel session"><XCircle className="h-4 w-4" /></Button>} title="Cancel this session?"
                desc={seatsTaken(d, s.id) ? `${seatsTaken(d, s.id)} participant(s) are booked. They will receive a schedule-change email; handle refunds or rescheduling from Bookings.` : 'No one is booked on this session yet.'} action="Cancel session" onConfirm={() => cancel(s)} />}
              <Confirm trigger={<Button size="sm" variant="ghost" aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>} title="Delete session?" desc="Sessions with bookings can't be deleted." action="Delete" onConfirm={() => remove(s)} />
            </div>,
          ])} />
      )}
      {edit && <SessionForm s={edit} onClose={() => setEdit(null)} onSave={(s) => {
        setDb((x) => s.id ? { ...x, sessions: x.sessions.map((y) => (y.id === s.id ? s : y)) } : { ...x, sessions: [...x.sessions, { ...s, id: uid() }] });
        toast.success('Schedule saved'); setEdit(null);
      }} />}
    </>
  );
}

function MonthView({ sessions, onPick }: { sessions: CourseSession[]; onPick: (s: CourseSession) => void }) {
  const db = useDemo().db!;
  const [m, setM] = useState(startOfMonth(new Date()));
  const days = eachDayOfInterval({ start: m, end: endOfMonth(m) });
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between"><Button size="sm" variant="ghost" onClick={() => setM(addMonths(m, -1))}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="font-display font-bold">{format(m, 'MMMM yyyy')}</span><Button size="sm" variant="ghost" onClick={() => setM(addMonths(m, 1))}><ChevronRight className="h-4 w-4" /></Button></div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((x) => <div key={x} className="p-1 text-center font-semibold text-muted-foreground">{x}</div>)}
        {Array.from({ length: getDay(m) }).map((_, i) => <div key={i} />)}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const items = sessions.filter((s) => s.dates.some((x) => x.date === key));
          return (
            <div key={key} className="min-h-24 rounded border p-1">
              <p className="font-semibold">{format(day, 'd')}</p>
              {items.slice(0, 3).map((s) => <button key={s.id} onClick={() => onPick(s)} className={`mt-0.5 block w-full truncate rounded px-1 text-left ${s.status === 'cancelled' ? 'bg-muted line-through' : 'bg-accent text-accent-foreground'}`}>{subName(db, s.subCityId)}</button>)}
              {items.length > 3 && <p className="text-muted-foreground">+{items.length - 3} more</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SessionForm({ s, onClose, onSave }: { s: CourseSession; onClose: () => void; onSave: (s: CourseSession) => void }) {
  const db = useDemo().db!;
  const [f, setF] = useState(s);
  const booked = s.id ? seatsTaken(db, s.id) : 0;
  const setCourse = (id: string) => { const n = db.courses.find((c) => c.id === id)!.sessionsCount; setF({ ...f, courseId: id, dates: Array.from({ length: n }, (_, i) => f.dates[i] ?? { date: '', start: '09:00', end: '17:00' }) }); };
  const valid = f.subCityId && f.capacity >= Math.max(1, booked) && f.dates.every((x) => x.date && x.start < x.end);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>{s.id ? 'Edit session' : 'Add course date'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Course" className="sm:col-span-2"><Select value={f.courseId} onValueChange={setCourse}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{db.courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Main City"><Select value={f.cityId} onValueChange={(v) => setF({ ...f, cityId: v, subCityId: '' })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{db.cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Sub-City"><Select value={f.subCityId || undefined} onValueChange={(v) => setF({ ...f, subCityId: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{db.subCities.filter((x) => x.cityId === f.cityId).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={`Capacity${booked ? ` (${booked} booked)` : ''}`}><Input type="number" min={Math.max(1, booked)} value={f.capacity} onChange={(e) => setF({ ...f, capacity: Number(e.target.value) })} /></Field>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{f.dates.length > 1 ? `${f.dates.length} mandatory sessions` : 'Date & time'}</p>
          {f.dates.map((x, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              {(['date', 'start', 'end'] as const).map((k) => <Input key={k} type={k === 'date' ? 'date' : 'time'} value={x[k]} onChange={(e) => setF({ ...f, dates: f.dates.map((y, j) => (j === i ? { ...y, [k]: e.target.value } : y)) })} />)}
            </div>
          ))}
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
