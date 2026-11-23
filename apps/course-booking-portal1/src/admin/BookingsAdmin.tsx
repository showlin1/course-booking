import { useState } from 'react';
import { Download, Eye, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { useDemo } from '../demo/store';
import { Confirm, DataTable, exportCsv, FilterSelect, PageHeader, SearchBox, StatusBadge, useFilters } from './ui';
import { cityName, courseName, fmtDT, subName, usd } from './helpers';
import BookingDetails from './BookingDetails';

export default function BookingsAdmin() {
  const { db, cancelBooking } = useDemo();
  const d = db!;
  const [q, setQ] = useState('');
  const [f, setF] = useFilters({ course: 'all', sub: 'all', pay: 'all', from: '' });
  const [view, setView] = useState<string | null>(null);
  const rows = d.bookings.filter((b) => (f.course === 'all' || b.courseId === f.course) && (f.sub === 'all' || b.subCityId === f.sub) && (f.pay === 'all' || b.paymentStatus === f.pay)
    && (!f.from || b.createdAt.slice(0, 10) >= f.from) && `${b.ref} ${b.contact.name} ${b.contact.email}`.toLowerCase().includes(q.toLowerCase()));
  const head = ['Reference', 'Customer', 'Course', 'Main City', 'Sub-City', 'Booked On', 'Amount', 'Discount', 'Payment', 'Status'];

  return (
    <>
      <PageHeader title="Bookings & Payments" sub="Payment provider settings are managed in your connected business account — no card data is shown here"
        actions={<Button variant="outline" onClick={() => exportCsv('bookings', head, rows.map((b) => [b.ref, b.contact.name, courseName(d, b.courseId), cityName(d, b.cityId), subName(d, b.subCityId), b.createdAt.slice(0, 10), b.total, b.discount, b.paymentStatus, b.status]))}><Download className="mr-1 h-4 w-4" />Export</Button>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Search ref, name, email" />
        <FilterSelect value={f.course} onChange={(v) => setF('course', v)} all="All courses" options={d.courses.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect value={f.sub} onChange={(v) => setF('sub', v)} all="All locations" options={d.subCities.map((s) => ({ value: s.id, label: `${s.name} (${cityName(d, s.cityId)})` }))} />
        <FilterSelect value={f.pay} onChange={(v) => setF('pay', v)} all="Any payment" options={['paid', 'pending', 'failed', 'refunded'].map((s) => ({ value: s, label: s }))} />
        <Input type="date" value={f.from} onChange={(e) => setF('from', e.target.value)} className="w-full sm:w-44" aria-label="Booked from" />
      </div>
      <DataTable head={[...head, 'Actions']} empty="No bookings match these filters."
        rows={rows.map((b) => [
          <button className="font-mono font-semibold hover:text-primary" onClick={() => setView(b.id)}>{b.ref}</button>, b.contact.name, courseName(d, b.courseId), cityName(d, b.cityId), subName(d, b.subCityId),
          fmtDT(b.createdAt), usd(b.total), b.discount ? `${usd(b.discount)}${b.promoCode ? ` (${b.promoCode})` : ''}` : '—', <StatusBadge s={b.paymentStatus} />, <StatusBadge s={b.status} />,
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setView(b.id)} aria-label="View"><Eye className="h-4 w-4" /></Button>
            {b.status !== 'cancelled' && <Confirm trigger={<Button size="sm" variant="ghost" aria-label="Cancel booking"><XCircle className="h-4 w-4 text-destructive" /></Button>}
              title={`Cancel booking ${b.ref}?`} desc="Seats are released and the customer gets a cancellation email. Paid bookings are marked refunded (process the actual refund in your payment provider)." action="Cancel booking"
              onConfirm={() => { cancelBooking(b.id); toast.success('Booking cancelled'); }} />}
          </div>,
        ])} />
      {view && <BookingDetails id={view} onClose={() => setView(null)} />}
    </>
  );
}
