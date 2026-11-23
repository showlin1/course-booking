import { useState } from 'react';
import { z } from 'zod';
import { Loader2, Tag, X } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { money } from '../../courses';
import { useDemo } from '../../demo/store';

export type Details = { name: string; email: string; phone: string; count: number; extra: { name: string; email: string }[] };
export type AppliedPromo = { code: string; discount: number } | null;

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().regex(/^[0-9+()\-\s]{7,}$/, 'Please enter a valid phone number'),
  extra: z.array(z.object({ name: z.string().trim().min(2, 'Name required'), email: z.string().trim().email('Valid email required').or(z.literal('')) })),
});

type Props = { d: Details; set: (d: Details) => void; maxCount: number; courseId: string; subtotal: number; promo: AppliedPromo; setPromo: (p: AppliedPromo) => void; onBack: () => void; onNext: () => void };

export default function DetailsStep({ d, set, maxCount, courseId, subtotal, promo, setPromo, onBack, onNext }: Props) {
  const { validatePromo } = useDemo();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [code, setCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [checking, setChecking] = useState(false);

  const setCount = (n: number) => {
    const count = Math.max(1, Math.min(maxCount, n));
    const extra = Array.from({ length: count - 1 }, (_, i) => d.extra[i] ?? { name: '', email: '' });
    set({ ...d, count, extra });
    if (promo) setPromo(null);
  };
  const apply = async () => {
    if (!code.trim()) return;
    setChecking(true); setPromoMsg('');
    const r = await validatePromo(code, courseId, subtotal);
    setChecking(false);
    if ('error' in r) setPromoMsg(r.error ?? 'Invalid code'); else { setPromo({ code: r.promo.code, discount: r.discount }); setCode(''); }
  };
  const next = () => {
    const r = schema.safeParse(d);
    if (r.success) { setErrors({}); return onNext(); }
    setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path.join('.'), i.message])));
  };
  const field = (k: 'name' | 'email' | 'phone', label: string, type = 'text') => (
    <div className="space-y-1.5">
      <Label>{label} *</Label>
      <Input type={type} value={d[k]} onChange={(e) => set({ ...d, [k]: e.target.value })} aria-invalid={!!errors[k]} />
      {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="font-display text-lg font-bold">Your details</h3>
        <div className="grid gap-4 sm:grid-cols-2">{field('name', 'Full Name')}{field('email', 'Email Address', 'email')}{field('phone', 'Phone Number', 'tel')}
          <div className="space-y-1.5">
            <Label>Number of Participants *</Label>
            <div className="flex h-10 items-center rounded-md border">
              <button className="h-full px-4 text-lg" onClick={() => setCount(d.count - 1)}>−</button>
              <span className="flex-1 text-center font-semibold">{d.count}</span>
              <button className="h-full px-4 text-lg" onClick={() => setCount(d.count + 1)}>+</button>
            </div>
            <p className="text-xs text-muted-foreground">{maxCount} seats available</p>
          </div>
        </div>
      </section>
      {d.extra.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-display text-lg font-bold">Additional participants</h3>
          {d.extra.map((p, i) => (
            <div key={i} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Participant {i + 2} name *</Label>
                <Input value={p.name} onChange={(e) => set({ ...d, extra: d.extra.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} />
                {errors[`extra.${i}.name`] && <p className="text-xs text-destructive">{errors[`extra.${i}.name`]}</p>}</div>
              <div className="space-y-1.5"><Label>Email (optional)</Label>
                <Input type="email" value={p.email} onChange={(e) => set({ ...d, extra: d.extra.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)) })} />
                {errors[`extra.${i}.email`] && <p className="text-xs text-destructive">{errors[`extra.${i}.email`]}</p>}</div>
            </div>
          ))}
        </section>
      )}
      <section className="space-y-3 rounded-xl border bg-muted/30 p-5">
        <h3 className="flex items-center gap-2 font-display font-bold"><Tag className="h-4 w-4 text-primary" />Promo code</h3>
        {promo ? (
          <div className="flex items-center justify-between rounded-md border border-primary/40 bg-accent px-4 py-2.5 text-sm">
            <span><b>{promo.code}</b> applied — you save {money(promo.discount)}</span>
            <button onClick={() => setPromo(null)} aria-label="Remove promo" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input placeholder="Enter Promo Code" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} />
            <Button variant="outline" onClick={apply} disabled={checking}>{checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}</Button>
          </div>
        )}
        {promoMsg && <p className="text-xs text-destructive">{promoMsg}</p>}
      </section>
      <div className="flex justify-between"><Button variant="outline" onClick={onBack}>Back</Button><Button onClick={next}>Review & Checkout</Button></div>
    </div>
  );
}
