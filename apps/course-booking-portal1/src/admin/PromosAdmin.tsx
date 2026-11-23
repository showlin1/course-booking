import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Switch } from '@project/components/ui/switch';
import { Checkbox } from '@project/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { useDemo } from '../demo/store';
import { uid, ymd } from '../demo/seed';
import type { Promo } from '../demo/types';
import { Confirm, DataTable, Field, PageHeader, SearchBox, StatusBadge } from './ui';
import { courseName, fmtD, usd } from './helpers';

export default function PromosAdmin() {
  const { db, setDb } = useDemo();
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<Promo | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');
  const d = db!;
  const status = (p: Promo) => (!p.active ? 'inactive' : p.end < today ? 'expired' : p.limit && p.used >= p.limit ? 'used up' : p.start > today ? 'scheduled' : 'active');
  const blank = (): Promo => ({ id: '', code: '', type: 'percent', value: 10, courseIds: [], start: today, end: ymd(new Date(Date.now() + 30 * 864e5)), limit: 0, used: 0, active: true });

  return (
    <>
      <PageHeader title="Promo Codes & Discounts" sub="Codes are checked at checkout" actions={<Button onClick={() => setEdit(blank())}><Plus className="mr-1 h-4 w-4" />Create Promo Code</Button>} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search codes" /></div>
      <DataTable head={['Code', 'Type', 'Value', 'Courses', 'Start', 'Expires', 'Limit', 'Used', 'Status', 'Actions']}
        rows={d.promos.filter((p) => p.code.toLowerCase().includes(q.toLowerCase())).map((p) => [
          <span className="font-mono font-semibold">{p.code}</span>, p.type === 'percent' ? 'Percentage' : 'Fixed amount', p.type === 'percent' ? `${p.value}%` : usd(p.value),
          p.courseIds.length ? <span title={p.courseIds.map((id) => courseName(d, id)).join(', ')}>{p.courseIds.length} course(s)</span> : 'All courses',
          fmtD(p.start), fmtD(p.end), p.limit || '∞', p.used, <StatusBadge s={status(p)} />,
          <div className="flex items-center gap-1">
            <Switch checked={p.active} onCheckedChange={(v) => setDb((x) => ({ ...x, promos: x.promos.map((y) => (y.id === p.id ? { ...y, active: v } : y)) }))} aria-label="Active" />
            <Button size="sm" variant="ghost" onClick={() => setEdit(p)}><Pencil className="h-4 w-4" /></Button>
            <Confirm trigger={<Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>} title={`Delete ${p.code}?`} desc="Existing bookings keep their discount." action="Delete"
              onConfirm={() => setDb((x) => ({ ...x, promos: x.promos.filter((y) => y.id !== p.id) }))} />
          </div>,
        ])} />
      {edit && <PromoForm p={edit} onClose={() => setEdit(null)} onSave={(p) => {
        const code = p.code.trim().toUpperCase();
        if (d.promos.some((x) => x.code === code && x.id !== p.id)) return toast.error('That code already exists');
        setDb((x) => p.id ? { ...x, promos: x.promos.map((y) => (y.id === p.id ? { ...p, code } : y)) } : { ...x, promos: [...x.promos, { ...p, code, id: uid() }] });
        toast.success('Promo code saved'); setEdit(null);
      }} />}
    </>
  );
}

function PromoForm({ p, onClose, onSave }: { p: Promo; onClose: () => void; onSave: (p: Promo) => void }) {
  const db = useDemo().db!;
  const [f, setF] = useState(p);
  const valid = /^[A-Za-z0-9_-]{3,}$/.test(f.code.trim()) && f.value > 0 && (f.type === 'fixed' || f.value <= 100) && f.start <= f.end;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader><DialogTitle>{p.id ? 'Edit promo code' : 'Create promo code'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Coupon Code"><Input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="SUMMER15" /></Field>
          <Field label="Discount Type"><Select value={f.type} onValueChange={(v) => setF({ ...f, type: v as Promo['type'] })}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="percent">Percentage</SelectItem><SelectItem value="fixed">Fixed amount</SelectItem></SelectContent></Select></Field>
          <Field label={f.type === 'percent' ? 'Discount (%)' : 'Discount ($)'}><Input type="number" min={0} value={f.value} onChange={(e) => setF({ ...f, value: Number(e.target.value) })} /></Field>
          <Field label="Usage Limit (0 = unlimited)"><Input type="number" min={0} value={f.limit} onChange={(e) => setF({ ...f, limit: Number(e.target.value) })} /></Field>
          <Field label="Start Date"><Input type="date" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></Field>
          <Field label="Expiration Date"><Input type="date" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} /></Field>
        </div>
        <Field label="Applicable Courses (none selected = all courses)">
          <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
            {db.courses.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm"><Checkbox checked={f.courseIds.includes(c.id)}
                onCheckedChange={(v) => setF({ ...f, courseIds: v ? [...f.courseIds, c.id] : f.courseIds.filter((x) => x !== c.id) })} />{c.name}</label>
            ))}
          </div>
        </Field>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
