import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/30 pt-20 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-black text-sm">
                MH
              </span>
              <div className="leading-none">
                <p className="text-xs font-bold tracking-[0.15em]">MH ENTERTAINMENT</p>
                <p className="text-[10px] tracking-[0.3em] text-muted-foreground">R E C O R D S</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une identité indépendante.
              <br />
              Une musique sans frontières.
              <br />
              Un univers MH Entertainment.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">La maison</h4>
            <div className="space-y-2">
              <FooterLink href="#maison">Notre vision</FooterLink>
              <FooterLink href="#submit">Pour les artistes</FooterLink>
              <FooterLink href="#submit">Pour les labels</FooterLink>
              <FooterLink href="#international">International</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Explorer</h4>
            <div className="space-y-2">
              <FooterLink href="#expertises">Nos expertises</FooterLink>
              <FooterLink href="#partners">Répertoire médias</FooterLink>
              <FooterLink href="#news">Journal</FooterLink>
              <FooterLink href="https://www.mhentertainment-records.com/contact" external>Contact</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Le prochain chapitre</h4>
            <div className="space-y-2">
              <FooterLink href="https://www.mhentertainment-records.com/envoyer-un-projet" external>Présenter un projet ↗</FooterLink>
              <FooterLink href="https://calendly.com/mhentertainment-shop/30min" external>Prendre rendez-vous ↗</FooterLink>
              <FooterLink href="https://www.mhentertainment-shop.fr" external>MH Entertainment Shop ↗</FooterLink>
              <FooterLink href="https://www.youtube.com/@MHENTERTAINMENT-SHOP" external>YouTube MH ↗</FooterLink>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 MH ENTERTAINMENT RECORDS · INDEPENDENT SPIRIT. GLOBAL VISION.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Informations légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
          </div>
        </div>

        <p className="text-center mt-16 text-6xl sm:text-8xl font-black text-border/20 tracking-tight select-none" aria-hidden="true">
          MH. MUSIC FIRST.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </a>
  );
}
