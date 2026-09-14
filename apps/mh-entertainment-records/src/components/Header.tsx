import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'La Maison', href: '#maison' },
  { label: 'Expertises', href: '#expertises' },
  { label: 'International', href: '#international' },
  { label: 'Actualités', href: '#news' },
  { label: 'Partenaires', href: '#partners' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <span className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-black text-sm tracking-tight">
            MH
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-xs font-bold tracking-[0.2em] text-foreground">MH ENTERTAINMENT</span>
            <span className="text-[10px] tracking-[0.35em] text-muted-foreground">R E C O R D S</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#submit"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-md hover:opacity-90 transition-opacity"
          >
            Votre projet ↗
          </a>
        </div>

        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-background border-t border-border/30 px-5 pb-6 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border/10"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#submit"
            className="mt-4 block text-center px-5 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-md"
            onClick={() => setMobileOpen(false)}
          >
            Présenter mon projet ↗
          </a>
        </nav>
      )}
    </header>
  );
}
