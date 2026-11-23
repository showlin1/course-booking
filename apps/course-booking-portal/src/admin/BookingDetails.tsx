import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { parseDate } from '../courses';
import { useDemo } from '../demo/store';
import { StatusBadge } from './ui';
import { cityName, courseName, fmtDT, subName, usd } from './helpers';

export default function BookingDetails({ id, onClose }: { id: string; onClose: () => void }) {
  const d = useDemo().db!;
  const b = d.bookings.find((x) => x.id === id);
  if (!b) return null;
  const s = d.sessions.find((x) => x.id === b.sessionId);
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => <div className="flex justify-between gap-4 py-1.5 text-sm"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader><DialogTitle>Booking {b.ref}</DialogTitle></DialogHeader>
        <section><p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Contact</p>
          <Row k="Name" v={b.contact.name} /><Row k="Email" v={b.contact.email} /><Row k="Phone" v={b.contact.phone || '—'} /></section>
        <section><p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Course & location</p>
          <Row k="Course" v={courseName(d, b.courseId)} /><Row k="Location" v={`${subName(d, b.subCityId)}, ${cityName(d, b.cityId)}`} />
          <Row k="Sessions" v={s?.dates.map((x) => <div key={x.date}>{format(parseDate(x.date), 'EEE, MMM d, yyyy')} · {x.start}–{x.end}</div>)} /></section>
        <section><p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Participants</p>
          {b.participants.map((p, i) => <Row key={i} k={p.name} v={<StatusBadge s={p.status} />} />)}</section>
        <section><p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Payment</p>
          <Row k="Original" v={usd(b.subtotal)} /><Row k={`Discount${b.promoCode ? ` (${b.promoCode})` : ''}`} v={usd(b.discount)} /><Row k="Total" v={usd(b.total)} />
          <Row k="Payment status" v={<StatusBadge s={b.paymentStatus} />} /><Row k="Booking status" v={<StatusBadge s={b.status} />} /></section>
        <section><p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">History</p>
          {b.audit.map((a, i) => <p key={i} className="text-xs text-muted-foreground">{fmtDT(a.at)} — {a.note}</p>)}</section>
      </DialogContent>
    </Dialog>
  );
}
