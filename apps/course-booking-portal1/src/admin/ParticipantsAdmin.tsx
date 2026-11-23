import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Mail, Plus, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { seatsTaken, useDemo } from '../demo/store';
import { makeRef, uid } from '../demo/seed';
import { Confirm, DataTable, exportCsv, Field, FilterSelect, PageHeader, SearchBox, StatusBadge, useFilters } from './ui';
import { cityName, courseName, fmtD, fmtDT, participantRows, ParticipantRow, sessionDate, subName, usd } from './helpers';
import BookingDetails from './BookingDetails';

export default function ParticipantsAdmin() {
  const { db, cancelParticipant } = useDemo();
  const nav = useNavigate();
  const d = db!;
  const [q, setQ] = useState('');
  const [f, setF] = useFilters({ course: 'all', city: 'all', sub: 'all', pay: 'all', from: '' });
  const [view, setView] = useState<ParticipantRow | null>(null);
  const [adding, setAdding] = useState(false);
  const rows = participantRows(d).filter((p) => (f.course === 'all' || p.b.courseId === f.course) && (f.city === 'all' || p.b.cityId === f.city) && (f.sub === 'all' || p.b.subCityId === f.sub)
    && (f.pay === 'all' || p.b.paymentStatus === f.pay) && (!f.from || sessionDate(d, p.b.sessionId) >= f.from) && `${p.name} ${p.email} ${p.b.ref}`.toLowerCase().includes(q.toLowerCase()));
  const head = ['Name', 'Email', 'Phone', 'Course', 'Main City', 'Sub-City', 'Course Date', 'Registered', 'Ref', 'Amount', 'Payment', 'Status'];
  const csv = () => exportCsv('participants', head, rows.map((p) => [p.name, p.email, p.phone, courseName(d, p.b.courseId), cityName(d, p.b.cityId), subName(d, p.b.subCityId), sessionDate(d, p.b.sessionId), fmtDT(p.b.createdAt), p.b.ref, p.b.total, p.b.paymentStatus, p.status]));

  return (
    <>
      <PageHeader title="Participants" sub={`${rows.length} participant(s)`} actions={<><Button variant="outline" onClick={csv}><Download className="mr-1 h-4 w-4" />Export CSV</Button><Button onClick={() => setAdding(true)}><Plus className="mr-1 h-4 w-4" />Add Participant</Button></>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, email, ref" />
        <FilterSelect value={f.course} onChange={(v) => setF('course', v)} all="All courses" options={d.courses.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.city} onChange={(v) => { setF('city', v); setF('sub', 'all'); }} all="All cities" options={d.cities.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.sub} onChange={(v) => setF('sub', v)} all="All sub-cities" options={d.subCities.filter((s) => f.city === 'all' || s.cityId === f.city).map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.pay} onChange={(v) => setF('pay', v)} all="Any payment" options={['paid', 'pending', 'failed', 'refunded'].map((s) => ({ value: s, label: s }))} />
        <Input type="date" value={f.from} onChange={(e) => setF('from', e.target.value)} className="w-full sm:w-44" aria-label="Course date from" />
      </div>
      <DataTable head={[...head, 'Actions']} empty="No participants match these filters."
        rows={rows.map((p) => [
          <button className="font-medium hover:text-primary" onClick={() => setView(p)}>{p.name}</button>, p.email, p.phone || '—', courseName(d, p.b.courseId), cityName(d, p.b.cityId), subName(d, p.b.subCityId),
          fmtD(sessionDate(d, p.b.sessionId)), fmtDT(p.b.createdAt), p.b.ref, usd(p.b.total), <StatusBadge s={p.b.paymentStatus} />, <StatusBadge s={p.status} />,
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setView(p)} aria-label="View"><Eye className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" disabled={!p.email} onClick={() => nav(`/admin/emails?to=${encodeURIComponent(p.email)}`)} aria-label="Email"><Mail className="h-4 w-4" /></Button>
            {p.status === 'registered' && <Confirm trigger={<Button size="sm" variant="ghost" aria-label="Cancel registration"><UserX className="h-4 w-4 text-destructive" /></Button>}
              title={`Cancel ${p.name}'s registration?`} desc="The booking and payment records are kept for your audit history." action="Cancel registration" onConfirm={() => { cancelParticipant(p.b.id, p.idx); toast.success('Registration cancelled'); }} />}
          </div>,
        ])} />
      {view && <BookingDetails id={view.b.id} onClose={() => setView(null)} />}
      {adding && <AddParticipant onClose={() => setAdding(false)} />}
    </>
  );
}

function AddParticipant({ onClose }: { onClose: () => void }) {
  const { db, setDb } = useDemo();
  const d = db!;
  const [f, setF] = useState({ sessionId: '', name: '', email: '', phone: '' });
  const open = d.sessions.filter((s) => s.status === 'scheduled' && seatsTaken(d, s.id) < s.capacity);
  const valid = f.sessionId && f.name.trim().length > 1 && /\S+@\S+\.\S+/.test(f.email);
  const save = () => {
    const s = d.sessions.find((x) => x.id === f.sessionId)!;
    const price = d.courses.find((c) => c.id === s.courseId)!.price;
    const now = new Date().toISOString();
    setDb((x) => ({ ...x, bookings: [{ id: uid(), ref: makeRef(), sessionId: s.id, courseId: s.courseId, cityId: s.cityId, subCityId: s.subCityId,
      contact: { name: f.name, email: f.email, phone: f.phone }, participants: [{ name: f.name, email: f.email, phone: f.phone, status: 'registered' }],
      subtotal: price, discount: 0, total: price, paymentStatus: 'pending', status: 'confirmed', createdAt: now, audit: [{ at: now, note: 'Added manually by admin' }] }, ...x.bookings] }));
    toast.success('Participant added'); onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add participant</DialogTitle></DialogHeader>
        <Field label="Session"><Select value={f.sessionId || undefined} onValueChange={(v) => setF({ ...f, sessionId: v })}><SelectTrigger><SelectValue placeholder="Choose a session" /></SelectTrigger>
          <SelectContent>{open.map((s) => <SelectItem key={s.id} value={s.id}>{fmtD(s.dates[0].date)} · {courseName(d, s.courseId)} · {subName(d, s.subCityId)}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Full name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Phone"><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={save}>Add</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
