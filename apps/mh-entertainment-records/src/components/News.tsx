import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';

export default function News() {
  const { t } = useLang();

  const articles = [
    { tag: 'STRATÉGIE', cat: t('news.a1.cat'), title: t('news.a1.title'), desc: t('news.a1.desc') },
    { tag: 'INTERNATIONAL', cat: t('news.a2.cat'), title: t('news.a2.title'), desc: t('news.a2.desc') },
    { tag: 'CRÉATION', cat: t('news.a3.cat'), title: t('news.a3.title'), desc: t('news.a3.desc') },
  ];

  return (
    <section id="news" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">{t('news.eyebrow')}</p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              {t('news.h2.1')}<br /><span className="text-muted-foreground">{t('news.h2.2')}</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:opacity-80 transition-opacity">
            {t('news.all')} <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <article key={a.tag} className="group p-6 rounded-lg border border-border/30 bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-default">
              <div className="w-full h-40 rounded-md bg-secondary/60 flex items-center justify-center mb-5">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold">MH / {a.tag}</span>
              </div>
              <p className="text-[10px] text-muted-foreground tracking-wide mb-2">{a.cat}</p>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.desc}</p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">{t('news.read')} <ArrowRight size={12} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
