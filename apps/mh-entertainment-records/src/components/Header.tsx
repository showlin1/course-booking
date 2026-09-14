import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang } from '../i18n';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle, t } = useLang();

  const navLinks = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.maison'), href: '#maison' },
    { label: t('nav.expertises'), href: '#expertises' },
    { label: t('nav.international'), href: '#international' },
    { label: t('nav.news'), href: '#news' },
    { label: t('nav.partners'), href: '#partners' },
    { label: t('nav.contact'), href: '#contact' },
  ];

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
            <a key={link.href} href={link.href} className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggle}
            className="px-3 py-2 text-primary font-bold text-xs border border-primary/40 rounded-md hover:bg-primary/10 transition-colors"
            aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <a href="#submit" className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-md hover:opacity-90 transition-opacity">
            {t('nav.project')}
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="px-2 py-1.5 text-primary font-bold text-xs border border-primary/40 rounded-md hover:bg-primary/10 transition-colors"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-background border-t border-border/30 px-5 pb-6 pt-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border/10" onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#submit" className="mt-4 block text-center px-5 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-md" onClick={() => setMobileOpen(false)}>
            {t('nav.submitMobile')}
          </a>
        </nav>
      )}
    </header>
  );
}
