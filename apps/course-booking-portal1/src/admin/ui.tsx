import { ReactNode, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Badge } from '@project/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@project/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@project/components/ui/alert-dialog';
import { cn } from '@project/components/lib/utils';

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h1>{sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}</div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: ReactNode; icon: ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-semibold uppercase tracking-wide">{label}</span>{icon}</div>
      <p className="mt-3 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

const TONE: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-800', confirmed: 'bg-emerald-100 text-emerald-800', active: 'bg-emerald-100 text-emerald-800', published: 'bg-emerald-100 text-emerald-800', scheduled: 'bg-emerald-100 text-emerald-800', registered: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800', draft: 'bg-amber-100 text-amber-800', 'demo (not sent)': 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800', cancelled: 'bg-red-100 text-red-800', expired: 'bg-red-100 text-red-800',
};
export function StatusBadge({ s }: { s: string }) {
  return <Badge variant="secondary" className={cn('whitespace-nowrap font-semibold capitalize', TONE[s] ?? 'bg-muted text-muted-foreground')}>{s}</Badge>;
}

export function DataTable({ head, rows, empty = 'Nothing here yet.' }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader><TableRow>{head.map((h) => <TableHead key={h} className="whitespace-nowrap">{h}</TableHead>)}</TableRow></TableHeader>
        <TableBody>
          {rows.length === 0 ? <TableRow><TableCell colSpan={head.length} className="py-12 text-center text-muted-foreground">{empty}</TableCell></TableRow>
            : rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j} className="whitespace-nowrap">{c}</TableCell>)}</TableRow>)}
        </TableBody>
      </Table>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = 'Search…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" /></div>
  );
}

export function FilterSelect({ value, onChange, all, options }: { value: string; onChange: (v: string) => void; all: string; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="all">{all}</SelectItem>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  );
}

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={cn('space-y-1.5', className)}><Label>{label}</Label>{children}</div>;
}

export function Confirm({ trigger, title, desc, action = 'Confirm', onConfirm }: { trigger: ReactNode; title: string; desc: string; action?: string; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{desc}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onConfirm}>{action}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useFilters<T extends Record<string, string>>(init: T) {
  const [f, setF] = useState(init);
  return [f, (k: keyof T, v: string) => setF((p) => ({ ...p, [k]: v }))] as const;
}

export function exportCsv(name: string, head: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const blob = new Blob([[head, ...rows].map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `${name}.csv`; a.click();
}
