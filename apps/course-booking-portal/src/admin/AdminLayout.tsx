import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, CalendarDays, CreditCard, Loader2, LogOut, Mail, MapPin, Settings, ShieldAlert, Tag, Users } from 'lucide-react';
import { useAuth, loginWithRedirect, logout } from 'zitejs/auth';
import { checkAdmin } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { cn } from '@project/components/lib/utils';
import { useDemo } from '../demo/store';

const NAV = [
  ['', 'Dashboard Overview', BarChart3], ['courses', 'Course Management', BookOpen], ['schedule', 'Calendar & Scheduling', CalendarDays],
  ['locations', 'Cities & Sub-Cities', MapPin], ['promos', 'Promo Codes', Tag], ['participants', 'Participants', Users],
  ['bookings', 'Bookings & Payments', CreditCard], ['emails', 'Email Management', Mail], ['settings', 'Settings', Settings],
] as const;

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const { db } = useDemo();
  const [admin, setAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    if (isLoading) return;
    if (!user) { loginWithRedirect(); return; }
    checkAdmin({}).then((r) => setAdmin(r.isAdmin)).catch(() => setAdmin(false));
  }, [isLoading, user]);

  if (isLoading || !user || admin === null || !db) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!admin) return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div><ShieldAlert className="mx-auto h-12 w-12 text-primary" /><h1 className="font-display mt-4 text-2xl font-extrabold">Admin access only</h1>
        <p className="mt-2 text-muted-foreground">{user.email} is not an administrator.</p>
        <div className="mt-6 flex justify-center gap-3"><Button asChild variant="outline"><Link to="/">Back to site</Link></Button><Button onClick={() => logout()}>Sign out</Button></div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <aside className="border-b bg-secondary text-secondary-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-0">
        <Link to="/" className="flex items-center gap-2 px-5 py-4"><span className="grid h-8 w-8 place-items-center rounded bg-primary font-bold text-primary-foreground">+</span><span className="font-display font-bold">Kanova Admin</span></Link>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {NAV.map(([to, label, Icon]) => (
            <NavLink key={to} to={`/admin/${to}`} end={to === ''} className={({ isActive }) => cn('flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition', isActive ? 'bg-primary text-primary-foreground' : 'opacity-75 hover:bg-white/10 hover:opacity-100')}>
              <Icon className="h-4 w-4" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 p-4 text-xs lg:block">
          <p className="truncate opacity-70">{user.email}</p>
          <button onClick={() => logout()} className="mt-2 flex items-center gap-2 opacity-80 hover:opacity-100"><LogOut className="h-3.5 w-3.5" />Sign out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="border-b bg-amber-50 px-6 py-2 text-xs text-amber-900">Demo mode — data is sample data stored in this browser. Payments and emails are simulated until the real backend is connected.</div>
        <div className="p-4 md:p-8"><Outlet /></div>
      </main>
    </div>
  );
}
