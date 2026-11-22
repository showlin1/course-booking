import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@project/components/ui/dropdown-menu';
import { useCourses } from '../courses';
import { LOCATIONS } from '../content';

const link = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-foreground'}`;

export default function Header() {
  const { courses } = useCourses();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-primary text-lg font-bold text-primary-foreground">+</span>
          <span className="font-display text-xl font-bold">Kanova Life</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={link}>Home</NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary">
              Course <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              <DropdownMenuItem asChild><Link to="/course" className="font-semibold">All Courses</Link></DropdownMenuItem>
              {courses.map((c) => (
                <DropdownMenuItem key={c.id} asChild><Link to={`/courses/${c.slug}`}>{c.name}</Link></DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <NavLink to="/locations" className={link}>Locations</NavLink>
          <NavLink to="/blog" className={link}>Blog</NavLink>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
          <Link to="/" className="block py-2">Home</Link>
          <Link to="/course" className="block py-2">Course</Link>
          <Link to="/locations" className="block py-2">Locations</Link>
          <Link to="/blog" className="block py-2">Blog</Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-2xl font-bold">Kanova Life</p>
          <p className="mt-2 text-sm opacity-70">Canadian Red Cross Training Partner</p>
        </div>
        <div className="text-sm opacity-80">
          <p className="mb-2 font-semibold opacity-100">Locations</p>
          {LOCATIONS.map((l) => <p key={l.name}>{l.name}</p>)}
        </div>
        <div className="text-sm opacity-80">
          <p className="mb-2 font-semibold opacity-100">Courses</p>
          <Link to="/course" className="hover:underline">View all courses</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-60">© 2025 All rights reserved.</div>
    </footer>
  );
}
