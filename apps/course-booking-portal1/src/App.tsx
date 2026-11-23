import { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from '@project/components/ui/sonner';
import { CoursesProvider } from './courses';
import { DemoProvider } from './demo/store';
import Header, { Footer } from './components/Header';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Book from './pages/Book';
import BookingConfirmation from './pages/BookingConfirmation';
import Locations from './pages/Locations';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import AdminLayout from './admin/AdminLayout';
import Overview from './admin/Overview';
import CoursesAdmin from './admin/CoursesAdmin';
import ScheduleAdmin from './admin/ScheduleAdmin';
import LocationsAdmin from './admin/LocationsAdmin';
import PromosAdmin from './admin/PromosAdmin';
import ParticipantsAdmin from './admin/ParticipantsAdmin';
import BookingsAdmin from './admin/BookingsAdmin';
import EmailsAdmin from './admin/EmailsAdmin';
import SettingsAdmin from './admin/SettingsAdmin';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CoursesProvider>
      <DemoProvider>
        <BrowserRouter>
          <ScrollTop />
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="courses" element={<CoursesAdmin />} />
              <Route path="schedule" element={<ScheduleAdmin />} />
              <Route path="locations" element={<LocationsAdmin />} />
              <Route path="promos" element={<PromosAdmin />} />
              <Route path="participants" element={<ParticipantsAdmin />} />
              <Route path="bookings" element={<BookingsAdmin />} />
              <Route path="emails" element={<EmailsAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/course" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/book/:slug" element={<Book />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </DemoProvider>
    </CoursesProvider>
  );
}
