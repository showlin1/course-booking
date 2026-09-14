import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';

export default function Maison() {
  const { t } = useLang();
  return (
    <section id="maison" className="py-24 md:py-36">
      <div className="rainbow-bar mb-24" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">{t('maison.eyebrow')}</p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              {t('maison.h2.1')}<br />{t('maison.h2.2')}<br />
              <span className="text-muted-foreground">{t('maison.h2.3')}</span>
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>{t('maison.p1')}</p>
            <p>{t('maison.p2')}</p>
            <p>{t('maison.p3')}</p>
            <a href="#submit" className="inline-flex items-center gap-2 text-primary font-bold text-sm mt-4 hover:opacity-80 transition-opacity">
              {t('maison.link')} <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          <a href="#submit" className="group p-8 md:p-10 rounded-lg border border-border/40 hover:border-primary/40 transition-all bg-card hover:bg-card/80">
            <span className="text-[10px] tracking-[0.25em] text-primary font-bold uppercase">ARTISTS FIRST</span>
            <h3 className="text-2xl font-bold mt-4 mb-3 group-hover:text-primary transition-colors">
              {t('maison.artists.h3.1')}<br />{t('maison.artists.h3.2')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{t('maison.artists.p')}</p>
            <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              {t('maison.artists.cta')} <ArrowRight size={14} />
            </span>
          </a>
          <a href="#submit" className="group p-8 md:p-10 rounded-lg border border-border/40 hover:border-primary/40 transition-all bg-card hover:bg-card/80">
            <span className="text-[10px] tracking-[0.25em] text-primary font-bold uppercase">LABELS & MUSIC COMPANIES</span>
            <h3 className="text-2xl font-bold mt-4 mb-3 group-hover:text-primary transition-colors">
              {t('maison.labels.h3.1')}<br />{t('maison.labels.h3.2')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{t('maison.labels.p')}</p>
            <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              {t('maison.labels.cta')} <ArrowRight size={14} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
