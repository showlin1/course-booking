import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { useDemo } from '../demo/store';
import { Confirm, Field, PageHeader } from './ui';

const INTEGRATIONS = [
  ['Bookings & availability', 'Wix Bookings'], ['Checkout & payments', 'Wix eCommerce checkout'], ['Promo codes', 'Wix coupons'],
  ['Courses & locations', 'Wix CMS collections'], ['Emails', 'Email provider'],
];

export default function SettingsAdmin() {
  const { db, setDb, reset } = useDemo();
  const s = db!.settings;
  const set = (p: Partial<typeof s>) => setDb((d) => ({ ...d, settings: { ...d.settings, ...p } }));
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border bg-card p-5">
          <h2 className="font-display font-bold">Business</h2>
          <Field label="Business name"><Input value={s.businessName} onChange={(e) => set({ businessName: e.target.value })} /></Field>
          <Field label="Reply-to email"><Input type="email" value={s.replyTo} onChange={(e) => set({ replyTo: e.target.value })} /></Field>
          <Field label="Send course reminders (days before)"><Input type="number" min={1} max={14} value={s.reminderDaysBefore} onChange={(e) => set({ reminderDaysBefore: Number(e.target.value) })} /></Field>
          <p className="text-xs text-muted-foreground">Admins are managed through the ZITE_ADMIN_EMAILS secret in the app settings.</p>
        </section>
        <section className="space-y-3 rounded-xl border bg-card p-5">
          <h2 className="font-display font-bold">Integrations</h2>
          {INTEGRATIONS.map(([what, svc]) => (
            <div key={what} className="flex items-center justify-between text-sm"><span>{what} <span className="text-muted-foreground">· {svc}</span></span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Pending</span></div>
          ))}
          <div className="border-t pt-4">
            <Confirm trigger={<Button variant="outline"><RotateCcw className="mr-1 h-4 w-4" />Reset demo data</Button>} title="Reset demo data?" desc="All demo changes in this browser are replaced with fresh sample data." action="Reset"
              onConfirm={() => { reset(); toast.success('Demo data reset'); }} />
          </div>
        </section>
      </div>
    </>
  );
}
