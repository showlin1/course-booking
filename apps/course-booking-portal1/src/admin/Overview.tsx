import { format } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BookOpen, CalendarDays, CheckCircle2, Clock, DollarSign, ListChecks, Users } from 'lucide-react';
import { seatsTaken, useDemo } from '../demo/store';
import { DataTable, PageHeader, StatCard, StatusBadge } from './ui';
import { cityName, courseName, fmtD, fmtDT, participantRows, subName, usd } from './helpers';

export default function Overview() {
  const db = useDemo().db!;
  const today = format(new Date(), 'yyyy-MM-dd');
  const upcoming = db.sessions.filter((s) => s.status === 'scheduled' && s.dates[0].date >= today).sort((a, b) => a.dates[0].date.localeCompare(b.dates[0].date));
  const live = db.bookings.filter((b) => b.status !== 'cancelled');
  const parts = participantRows(db).filter((p) => p.status === 'registered');
  const revenue = db.bookings.filter((b) => b.paymentStatus === 'paid').reduce((n, b) => n + b.total, 0);
  const byCourse = db.courses.map((c) => ({ name: c.name.split(' ').slice(0, 3).join(' '), bookings: live.filter((b) => b.courseId === c.id).length }));

  return (
    <>
      <PageHeader title="Dashboard Overview" sub={`Welcome back to ${db.settings.businessName}`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Total Courses" value={db.courses.length} icon={<BookOpen className="h-4 w-4" />} />
        <StatCard label="Active Courses" value={db.courses.filter((c) => c.status === 'published').length} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Upcoming Sessions" value={upcoming.length} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Participants" value={parts.length} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Bookings" value={db.bookings.length} icon={<ListChecks className="h-4 w-4" />} />
        <StatCard label="Revenue" value={usd(revenue)} icon={<DollarSign className="h-4 w-4" />} />
        <StatCard label="Pending Payments" value={db.bookings.filter((b) => b.paymentStatus === 'pending' || b.paymentStatus === 'failed').length} icon={<Clock className="h-4 w-4" />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section><h2 className="mb-3 font-display font-bold">Recent Bookings</h2>
          <DataTable head={['Ref', 'Customer', 'Course', 'Total', 'Status']} rows={db.bookings.slice(0, 6).map((b) => [b.ref, b.contact.name, courseName(db, b.courseId), usd(b.total), <StatusBadge s={b.status} />])} /></section>
        <section><h2 className="mb-3 font-display font-bold">Booking Statistics</h2>
          <div className="h-[290px] rounded-xl border bg-card p-4">
            <ResponsiveContainer><BarChart data={byCourse}><XAxis dataKey="name" fontSize={10} interval={0} angle={-15} textAnchor="end" height={50} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip /><Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </div></section>
        <section><h2 className="mb-3 font-display font-bold">Upcoming Courses</h2>
          <DataTable head={['Date', 'Course', 'Location', 'Seats']} rows={upcoming.slice(0, 6).map((s) => [fmtD(s.dates[0].date), courseName(db, s.courseId), `${subName(db, s.subCityId)}, ${cityName(db, s.cityId)}`, `${seatsTaken(db, s.id)}/${s.capacity}`])} /></section>
        <section><h2 className="mb-3 font-display font-bold">Recent Participants</h2>
          <DataTable head={['Name', 'Email', 'Course', 'Registered']} rows={parts.slice(0, 6).map((p) => [p.name, p.email, courseName(db, p.b.courseId), fmtDT(p.b.createdAt)])} /></section>
      </div>
    </>
  );
}
