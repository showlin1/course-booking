import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';

export default function Hero() {
  const { t } = useLang();
  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center pt-20">
      <img src="https://images.fillout.com/826458/kavdatwhwc/generated-images/8efvtfGsDbB1KBRfsyBV6D/img_SNlTOoCgP6VWk09A.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 md:py-32 w-full">
        <div className="max-w-2xl space-y-8">
          <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase">{t('hero.eyebrow')}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            {t('hero.h1.1')}<br />
            <em className="font-light italic text-muted-foreground">{t('hero.h1.2')}</em><br />
            <span className="text-gradient">{t('hero.h1.3')}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            {t('hero.lead')}<br />{t('hero.lead2')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="#maison" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-md hover:opacity-90 transition-opacity">
              {t('hero.cta1')} <ArrowRight size={16} />
            </a>
            <a href="#submit" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground font-bold text-sm rounded-md hover:bg-secondary transition-colors">
              {t('hero.cta2')} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 hidden md:flex justify-between max-w-7xl mx-auto px-8 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
        <span>MH ENTERTAINMENT RECORDS</span>
        <span>ARTISTS · LABELS · MUSIC COMPANIES</span>
        <a href="#maison" className="hover:text-primary transition-colors">{t('hero.bottom3')}</a>
      </div>
    </section>
  );
}
