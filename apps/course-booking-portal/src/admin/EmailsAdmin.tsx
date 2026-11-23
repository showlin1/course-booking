import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Switch } from '@project/components/ui/switch';
import { Checkbox } from '@project/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@project/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { renderTemplate, useDemo } from '../demo/store';
import type { TemplateKey } from '../demo/types';
import { DataTable, Field, FilterSelect, PageHeader, StatusBadge, useFilters } from './ui';
import { fmtDT, participantRows, sessionDate } from './helpers';

export default function EmailsAdmin() {
  const [params] = useSearchParams();
  return (
    <>
      <PageHeader title="Email Management" sub="Emails are logged as demo until an email service is connected" />
      <Tabs defaultValue="compose">
        <TabsList className="flex-wrap"><TabsTrigger value="compose">Compose</TabsTrigger><TabsTrigger value="templates">Templates</TabsTrigger><TabsTrigger value="auto">Automated Emails</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>
        <TabsContent value="compose"><Composer initialTo={params.get('to') ?? ''} /></TabsContent>
        <TabsContent value="templates"><Templates /></TabsContent>
        <TabsContent value="auto"><Automations /></TabsContent>
        <TabsContent value="history"><History /></TabsContent>
      </Tabs>
    </>
  );
}

function Composer({ initialTo }: { initialTo: string }) {
  const { db, sendEmail } = useDemo();
  const d = db!;
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [one, setOne] = useState(initialTo);
  const [f, setF] = useFilters({ course: 'all', city: 'all', sub: 'all', status: 'all', from: '' });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [tpl, setTpl] = useState<TemplateKey>('announcement');
  const [subject, setSubject] = useState(d.templates.find((t) => t.key === 'announcement')!.subject);
  const [body, setBody] = useState(d.templates.find((t) => t.key === 'announcement')!.body);
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);

  const all = participantRows(d).filter((p) => p.email);
  const people = [...new Map(all.map((p) => [p.email, p])).values()];
  const group = useMemo(() => people.filter((p) => (f.course === 'all' || p.b.courseId === f.course) && (f.city === 'all' || p.b.cityId === f.city) && (f.sub === 'all' || p.b.subCityId === f.sub)
    && (f.status === 'all' || p.b.status === f.status) && (!f.from || sessionDate(d, p.b.sessionId) >= f.from)), [people, f, d]);
  const recipients = mode === 'individual' ? (one ? [one] : []) : group.filter((p) => picked.has(p.email)).map((p) => p.email);
  const sample = all.find((p) => p.email === recipients[0])?.b;

  const pickTpl = (k: TemplateKey) => { const t = d.templates.find((x) => x.key === k)!; setTpl(k); setSubject(t.subject); setBody(t.body); };
  const send = async () => {
    setSending(true);
    await sendEmail(recipients, subject, d.templates.find((t) => t.key === tpl)!.name);
    setSending(false); toast.success(`Email logged for ${recipients.length} recipient(s) (demo)`); setPicked(new Set());
  };

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex gap-2"><Button size="sm" variant={mode === 'individual' ? 'default' : 'outline'} onClick={() => setMode('individual')}>Individual</Button><Button size="sm" variant={mode === 'group' ? 'default' : 'outline'} onClick={() => setMode('group')}>Group</Button></div>
        {mode === 'individual' ? (
          <Field label="Recipient"><Select value={one || undefined} onValueChange={setOne}><SelectTrigger><SelectValue placeholder="Choose a participant" /></SelectTrigger>
            <SelectContent>{people.map((p) => <SelectItem key={p.email} value={p.email}>{p.name} — {p.email}</SelectItem>)}</SelectContent></Select></Field>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <FilterSelect value={f.course} onChange={(v) => setF('course', v)} all="All courses" options={d.courses.map((c) => ({ value: c.id, label: c.name }))} />
              <FilterSelect value={f.city} onChange={(v) => { setF('city', v); setF('sub', 'all'); }} all="All cities" options={d.cities.map((c) => ({ value: c.id, label: c.name }))} />
              <FilterSelect value={f.sub} onChange={(v) => setF('sub', v)} all="All sub-cities" options={d.subCities.filter((s) => f.city === 'all' || s.cityId === f.city).map((c) => ({ value: c.id, label: c.name }))} />
              <FilterSelect value={f.status} onChange={(v) => setF('status', v)} all="Any booking status" options={['confirmed', 'pending', 'cancelled'].map((s) => ({ value: s, label: s }))} />
              <Input type="date" value={f.from} onChange={(e) => setF('from', e.target.value)} className="w-full sm:w-44" aria-label="Course date from" />
            </div>
            <div className="max-h-56 overflow-y-auto rounded-md border">
              <label className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2 text-sm font-semibold"><Checkbox checked={group.length > 0 && group.every((p) => picked.has(p.email))} onCheckedChange={(v) => setPicked(v ? new Set(group.map((p) => p.email)) : new Set())} />Select all ({group.length})</label>
              {group.map((p) => <label key={p.email} className="flex items-center gap-2 px-3 py-1.5 text-sm"><Checkbox checked={picked.has(p.email)} onCheckedChange={(v) => { const n = new Set(picked); v ? n.add(p.email) : n.delete(p.email); setPicked(n); }} />{p.name} <span className="text-muted-foreground">{p.email}</span></label>)}
              {group.length === 0 && <p className="p-4 text-sm text-muted-foreground">No participants match.</p>}
            </div>
          </>
        )}
      </div>
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <Field label="Template"><Select value={tpl} onValueChange={(v) => pickTpl(v as TemplateKey)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{d.templates.map((t) => <SelectItem key={t.key} value={t.key}>{t.name}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Subject"><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        <Field label="Message"><Textarea rows={9} value={body} onChange={(e) => setBody(e.target.value)} /></Field>
        <p className="text-xs text-muted-foreground">Placeholders: {'{{customerName}} {{bookingRef}} {{courseName}} {{mainCity}} {{subCity}} {{schedule}} {{total}} {{status}}'}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPreview(true)}><Eye className="mr-1 h-4 w-4" />Preview</Button>
          <Button disabled={!recipients.length || !subject.trim() || sending} onClick={send}>{sending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Send className="mr-1 h-4 w-4" />}Send to {recipients.length}</Button>
        </div>
      </div>
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{renderTemplate(subject, d, sample)}</DialogTitle></DialogHeader>
          <pre className="whitespace-pre-wrap rounded-md bg-muted/40 p-4 font-sans text-sm">{renderTemplate(body, d, sample)}</pre></DialogContent>
      </Dialog>
    </div>
  );
}

function Templates() {
  const { db, setDb } = useDemo();
  const [key, setKey] = useState<TemplateKey>('confirmation');
  const t = db!.templates.find((x) => x.key === key)!;
  const set = (p: { subject?: string; body?: string }) => setDb((d) => ({ ...d, templates: d.templates.map((x) => (x.key === key ? { ...x, ...p } : x)) }));
  return (
    <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr]">
      <div className="space-y-1">{db!.templates.map((x) => <button key={x.key} onClick={() => setKey(x.key)} className={`block w-full rounded-md px-3 py-2 text-left text-sm ${x.key === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{x.name}</button>)}</div>
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <Field label="Subject"><Input value={t.subject} onChange={(e) => set({ subject: e.target.value })} /></Field>
        <Field label="Body"><Textarea rows={12} value={t.body} onChange={(e) => set({ body: e.target.value })} /></Field>
        <p className="text-xs text-muted-foreground">Changes save automatically.</p>
      </div>
    </div>
  );
}

function Automations() {
  const { db, setDb } = useDemo();
  const desc: Partial<Record<TemplateKey, string>> = { confirmation: 'Sent when a payment is verified and the booking is confirmed', cancellation: 'Sent when a booking is cancelled', reminder: `Sent ${db!.settings.reminderDaysBefore} day(s) before the course (needs a scheduled job once connected)`, schedule: 'Sent when a booked session is cancelled or changed' };
  return (
    <div className="mt-4 divide-y rounded-xl border bg-card">
      {db!.templates.filter((t) => desc[t.key]).map((t) => (
        <div key={t.key} className="flex items-center justify-between gap-4 p-5">
          <div><p className="font-semibold">{t.name}</p><p className="text-sm text-muted-foreground">{desc[t.key]}</p></div>
          <Switch checked={t.automated} onCheckedChange={(v) => setDb((d) => ({ ...d, templates: d.templates.map((x) => (x.key === t.key ? { ...x, automated: v } : x)) }))} />
        </div>
      ))}
    </div>
  );
}

function History() {
  const db = useDemo().db!;
  return <div className="mt-4"><DataTable head={['Recipient', 'Subject', 'Type', 'Sent', 'Delivery']} empty="No emails yet." rows={db.emails.map((e) => [e.to, e.subject, e.type, fmtDT(e.sentAt), <StatusBadge s={e.status} />])} /></div>;
}
