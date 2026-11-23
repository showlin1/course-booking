// Shared data model for the booking flow + admin dashboard.
// Demo data lives in the browser; each shape is chosen to map onto a later
// backend (Wix Bookings services/sessions, Wix CMS collections, Wix coupons).

export type Status = 'active' | 'inactive';

export type DemoCourse = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  sessionsCount: number;
  objectives: string;
  requirements: string;
  status: 'published' | 'draft' | 'archived';
};

export type City = { id: string; name: string; status: Status };
export type SubCity = { id: string; cityId: string; name: string; address: string; status: Status };

export type SessionDate = { date: string; start: string; end: string };

export type CourseSession = {
  id: string;
  courseId: string;
  cityId: string;
  subCityId: string;
  dates: SessionDate[]; // multi-session courses have several mandatory dates
  capacity: number;
  status: 'scheduled' | 'cancelled';
};

export type Participant = { name: string; email: string; phone?: string; status: 'registered' | 'cancelled' };

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  ref: string;
  sessionId: string;
  courseId: string;
  cityId: string;
  subCityId: string;
  contact: { name: string; email: string; phone: string };
  participants: Participant[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt: string;
  audit: { at: string; note: string }[];
};

export type Promo = {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  courseIds: string[]; // empty = all courses
  start: string;
  end: string;
  limit: number; // 0 = unlimited
  used: number;
  active: boolean;
};

export type TemplateKey = 'confirmation' | 'reminder' | 'cancellation' | 'schedule' | 'announcement';
export type EmailTemplate = { key: TemplateKey; name: string; subject: string; body: string; automated: boolean };
export type EmailLog = { id: string; to: string; subject: string; type: string; sentAt: string; status: 'demo (not sent)' | 'sent' | 'failed' };

export type Settings = { businessName: string; replyTo: string; reminderDaysBefore: number };

export type DemoDb = {
  seeded: boolean;
  courses: DemoCourse[];
  cities: City[];
  subCities: SubCity[];
  sessions: CourseSession[];
  bookings: Booking[];
  promos: Promo[];
  templates: EmailTemplate[];
  emails: EmailLog[];
  settings: Settings;
};
