import { useState } from 'react';
import { format } from 'date-fns';
import { Archive, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useUpload } from 'zitejs/upload';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { useDemo } from '../demo/store';
import { uid } from '../demo/seed';
import type { DemoCourse } from '../demo/types';
import { Confirm, DataTable, Field, PageHeader, SearchBox, StatusBadge } from './ui';
import { cityName, usd } from './helpers';

const blank: DemoCourse = { id: '', slug: '', name: '', image: '', category: 'First Aid', description: '', duration: '1 day', price: 0, sessionsCount: 1, objectives: '', requirements: '', status: 'draft' };

export default function CoursesAdmin() {
  const { db, setDb } = useDemo();
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<DemoCourse | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');
  const list = db!.courses.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const update = (id: string, p: Partial<DemoCourse>) => setDb((d) => ({ ...d, courses: d.courses.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  const remove = (c: DemoCourse) => {
    if (db!.bookings.some((b) => b.courseId === c.id)) { update(c.id, { status: 'archived' }); toast('Course has bookings, so it was archived instead of deleted'); return; }
    setDb((d) => ({ ...d, courses: d.courses.filter((x) => x.id !== c.id), sessions: d.sessions.filter((s) => s.courseId !== c.id) }));
    toast.success('Course deleted');
  };

  return (
    <>
      <PageHeader title="Course Management" sub="Add, edit, publish and price your courses" actions={<Button onClick={() => setEdit({ ...blank })}><Plus className="mr-1 h-4 w-4" />Add New Course</Button>} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search courses" /></div>
      <DataTable head={['', 'Course', 'Category', 'Price', 'Duration', 'Locations', 'Upcoming', 'Participants', 'Status', 'Actions']}
        rows={list.map((c) => {
          const sess = db!.sessions.filter((s) => s.courseId === c.id && s.status === 'scheduled');
          const locs = [...new Set(sess.map((s) => cityName(db!, s.cityId)))];
          const parts = db!.bookings.filter((b) => b.courseId === c.id && b.status !== 'cancelled').reduce((n, b) => n + b.participants.filter((p) => p.status === 'registered').length, 0);
          return [
            c.image ? <img src={c.image} alt="" className="h-10 w-14 rounded object-cover" /> : <div className="h-10 w-14 rounded bg-muted" />,
            <span className="font-medium">{c.name}</span>, c.category, usd(c.price), c.duration, locs.join(', ') || '—',
            sess.filter((s) => s.dates[0].date >= today).length, parts, <StatusBadge s={c.status} />,
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setEdit(c)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => update(c.id, { status: c.status === 'published' ? 'draft' : 'published' })}>{c.status === 'published' ? 'Unpublish' : 'Publish'}</Button>
              {c.status !== 'archived' && <Button size="sm" variant="ghost" onClick={() => update(c.id, { status: 'archived' })} aria-label="Archive"><Archive className="h-4 w-4" /></Button>}
              <Confirm trigger={<Button size="sm" variant="ghost" aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>} title="Delete course?" desc="Courses with bookings are archived instead, to keep booking history." action="Delete" onConfirm={() => remove(c)} />
            </div>,
          ];
        })} />
      {edit && <CourseForm c={edit} onClose={() => setEdit(null)} onSave={(c) => {
        const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setDb((d) => c.id ? { ...d, courses: d.courses.map((x) => (x.id === c.id ? { ...c, slug } : x)) } : { ...d, courses: [...d.courses, { ...c, id: uid(), slug }] });
        toast.success('Course saved'); setEdit(null);
      }} />}
    </>
  );
}

function CourseForm({ c, onClose, onSave }: { c: DemoCourse; onClose: () => void; onSave: (c: DemoCourse) => void }) {
  const [f, setF] = useState(c);
  const { upload, isUploading } = useUpload();
  const set = (p: Partial<DemoCourse>) => setF((x) => ({ ...x, ...p }));
  const valid = f.name.trim() && f.price >= 0 && f.sessionsCount >= 1;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>{c.id ? 'Edit course' : 'Add new course'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Course Title *" className="sm:col-span-2"><Input value={f.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea rows={3} value={f.description} onChange={(e) => set({ description: e.target.value })} /></Field>
          <Field label="Course Image" className="sm:col-span-2">
            <div className="flex gap-2"><Input placeholder="Image URL" value={f.image} onChange={(e) => set({ image: e.target.value })} />
              <Button type="button" variant="outline" disabled={isUploading} asChild><label className="cursor-pointer"><Upload className="mr-1 h-4 w-4" />Upload
                <input type="file" accept="image/*" hidden onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { set({ image: (await upload(file)).url }); } catch { toast.error('Upload failed'); } }} /></label></Button></div>
          </Field>
          <Field label="Category"><Input value={f.category} onChange={(e) => set({ category: e.target.value })} /></Field>
          <Field label="Duration"><Input value={f.duration} onChange={(e) => set({ duration: e.target.value })} /></Field>
          <Field label="Price ($) *"><Input type="number" min={0} value={f.price} onChange={(e) => set({ price: Number(e.target.value) })} /></Field>
          <Field label="Number of Sessions *"><Input type="number" min={1} max={10} value={f.sessionsCount} onChange={(e) => set({ sessionsCount: Number(e.target.value) })} /></Field>
          <Field label="Learning Objectives (one per line)"><Textarea rows={3} value={f.objectives} onChange={(e) => set({ objectives: e.target.value })} /></Field>
          <Field label="Requirements (one per line)"><Textarea rows={3} value={f.requirements} onChange={(e) => set({ requirements: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={f.status} onValueChange={(v) => set({ status: v as DemoCourse['status'] })}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
          </Field>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
