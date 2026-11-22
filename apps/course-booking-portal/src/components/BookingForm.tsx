import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createBooking } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Textarea } from '@project/components/ui/textarea';
import type { Course } from '../courses';
import type { Slot } from '../pages/Book';

const schema = z.object({
  fullName: z.string().trim().min(1, 'Please enter your name'),
  email: z.string().trim().email('Please enter a valid email'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number'),
  notes: z.string().optional(),
});
type Values = z.infer<typeof schema>;

type Props = { course: Course; date: Date; slot: Slot; onBack: () => void; onDone: () => void };

export default function BookingForm({ course, date, slot, onBack, onDone }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const submit = async (v: Values) => {
    try {
      await createBooking({ ...v, courseId: course.id, location: slot.location, venue: slot.venue, sessionDate: format(date, 'yyyy-MM-dd') });
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Booking failed, please try again');
    }
  };
  const field = (name: keyof Values, label: string, type = 'text') => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} className="mt-1.5 bg-card" {...register(name)} />
      {errors[name] && <p className="mt-1 text-sm text-destructive">{errors[name]?.message}</p>}
    </div>
  );
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="font-display text-xl font-bold">Your details</h2>
        <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-primary">← Change date</button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {field('fullName', 'Full name *')}
        {field('email', 'Email *', 'email')}
        {field('phone', 'Phone *', 'tel')}
      </div>
      <div>
        <Label htmlFor="notes">Add your message</Label>
        <Textarea id="notes" className="mt-1.5 bg-card" rows={4} {...register('notes')} />
      </div>
      <div className="rounded border bg-card p-4 text-sm">
        <div className="flex justify-between"><span>Total</span><span className="font-bold">${course.price.toFixed(2)}</span></div>
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-64" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Book Now
      </Button>
    </form>
  );
}
