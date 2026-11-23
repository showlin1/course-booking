import { useState } from 'react';
import { ChevronRight, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Switch } from '@project/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { useDemo } from '../demo/store';
import { uid } from '../demo/seed';
import type { SubCity } from '../demo/types';
import { Confirm, Field, PageHeader, StatusBadge } from './ui';

type Editing = { kind: 'city'; id: string; name: string } | { kind: 'sub'; sub: SubCity };

export default function LocationsAdmin() {
  const { db, setDb } = useDemo();
  const [edit, setEdit] = useState<Editing | null>(null);
  const d = db!;
  const used = (key: 'cityId' | 'subCityId', id: string) => d.sessions.some((s) => s[key] === id) || d.bookings.some((b) => b[key] === id);

  const removeCity = (id: string) => {
    if (used('cityId', id)) return toast.error('This city has sessions or bookings — deactivate it instead.');
    setDb((x) => ({ ...x, cities: x.cities.filter((c) => c.id !== id), subCities: x.subCities.filter((s) => s.cityId !== id) }));
  };
  const removeSub = (id: string) => {
    if (used('subCityId', id)) return toast.error('This location has sessions or bookings — deactivate it instead.');
    setDb((x) => ({ ...x, subCities: x.subCities.filter((s) => s.id !== id) }));
  };
  const save = () => {
    if (!edit) return;
    if (edit.kind === 'city') {
      if (!edit.name.trim()) return;
      setDb((x) => edit.id ? { ...x, cities: x.cities.map((c) => (c.id === edit.id ? { ...c, name: edit.name } : c)) } : { ...x, cities: [...x.cities, { id: uid(), name: edit.name, status: 'active' }] });
    } else {
      const s = edit.sub;
      if (!s.name.trim() || !s.cityId) return;
      setDb((x) => s.id ? { ...x, subCities: x.subCities.map((y) => (y.id === s.id ? s : y)) } : { ...x, subCities: [...x.subCities, { ...s, id: uid() }] });
    }
    toast.success('Location saved'); setEdit(null);
  };

  return (
    <>
      <PageHeader title="Main City & Sub-City Management" sub="This structure drives the customer's location dropdowns"
        actions={<>
          <Button variant="outline" onClick={() => setEdit({ kind: 'sub', sub: { id: '', cityId: d.cities[0]?.id ?? '', name: '', address: '', status: 'active' } })}><Plus className="mr-1 h-4 w-4" />Add Sub-City</Button>
          <Button onClick={() => setEdit({ kind: 'city', id: '', name: '' })}><Plus className="mr-1 h-4 w-4" />Add Main City</Button></>} />
      <div className="space-y-4">
        {d.cities.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card">
            <div className="flex flex-wrap items-center gap-3 border-b p-4">
              <MapPin className="h-5 w-5 text-primary" /><h2 className="font-display text-lg font-bold">{c.name}</h2><StatusBadge s={c.status} />
              <div className="ml-auto flex items-center gap-2">
                <Switch checked={c.status === 'active'} onCheckedChange={(v) => setDb((x) => ({ ...x, cities: x.cities.map((y) => (y.id === c.id ? { ...y, status: v ? 'active' : 'inactive' } : y)) }))} aria-label="Active" />
                <Button size="sm" variant="ghost" onClick={() => setEdit({ kind: 'city', id: c.id, name: c.name })}><Pencil className="h-4 w-4" /></Button>
                <Confirm trigger={<Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>} title={`Remove ${c.name}?`} desc="All its sub-cities will be removed too. Cities in use can only be deactivated." action="Remove" onConfirm={() => removeCity(c.id)} />
              </div>
            </div>
            <ul className="divide-y">
              {d.subCities.filter((s) => s.cityId === c.id).map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 pl-8 text-sm">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{s.name}</span>{s.address && <span className="text-muted-foreground">{s.address}</span>}<StatusBadge s={s.status} />
                  <div className="ml-auto flex items-center gap-2">
                    <Switch checked={s.status === 'active'} onCheckedChange={(v) => setDb((x) => ({ ...x, subCities: x.subCities.map((y) => (y.id === s.id ? { ...y, status: v ? 'active' : 'inactive' } : y)) }))} aria-label="Active" />
                    <Button size="sm" variant="ghost" onClick={() => setEdit({ kind: 'sub', sub: s })}><Pencil className="h-4 w-4" /></Button>
                    <Confirm trigger={<Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>} title={`Remove ${s.name}?`} desc="Locations in use can only be deactivated." action="Remove" onConfirm={() => removeSub(s.id)} />
                  </div>
                </li>
              ))}
              {!d.subCities.some((s) => s.cityId === c.id) && <li className="px-8 py-4 text-sm text-muted-foreground">No sub-cities yet.</li>}
            </ul>
          </div>
        ))}
      </div>
      {edit && (
        <Dialog open onOpenChange={(o) => !o && setEdit(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit.kind === 'city' ? (edit.id ? 'Edit main city' : 'Add main city') : edit.sub.id ? 'Edit sub-city' : 'Add sub-city'}</DialogTitle></DialogHeader>
            {edit.kind === 'city' ? <Field label="City name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field> : (
              <div className="space-y-4">
                <Field label="Main City"><Select value={edit.sub.cityId} onValueChange={(v) => setEdit({ kind: 'sub', sub: { ...edit.sub, cityId: v } })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{d.cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
                <Field label="Sub-City / training location"><Input value={edit.sub.name} onChange={(e) => setEdit({ kind: 'sub', sub: { ...edit.sub, name: e.target.value } })} /></Field>
                <Field label="Address (optional)"><Input value={edit.sub.address} onChange={(e) => setEdit({ kind: 'sub', sub: { ...edit.sub, address: e.target.value } })} /></Field>
              </div>
            )}
            <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
