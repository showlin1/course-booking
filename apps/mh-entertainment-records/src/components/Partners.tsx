import { useLang } from '../i18n';

const partners = [
  'Universal Music France', 'Sony Music France', 'Warner Music France',
  'Believe', 'The Orchard', 'Virgin Music Group',
  'Wagram Stories', '[PIAS]', 'Because Music',
  'TF1', 'M6', 'France Télévisions', 'Canal+',
  'NRJ', 'RTL', 'Europe 1', 'Fun Radio',
  'Billboard', 'Rolling Stone', 'Les Inrockuptibles', 'Télérama',
];

export default function Partners() {
  const { t } = useLang();
  return (
    <section id="partners" className="py-24 md:py-36">
      <div className="rainbow-bar mb-24" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">{t('partners.eyebrow')}</p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              {t('partners.h2.1')}<br /><span className="text-muted-foreground">{t('partners.h2.2')}</span>
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {partners.map((p) => (
            <span key={p} className="px-5 py-3 text-sm font-medium border border-border/40 rounded-md text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-default">{p}</span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/60 mt-6">{t('partners.disclaimer')}</p>
      </div>
    </section>
  );
}
