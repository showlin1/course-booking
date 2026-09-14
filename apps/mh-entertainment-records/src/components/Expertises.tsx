import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';

const tags = ['VIDEO CAMPAIGNS', 'MUSIC DISCOVERY', 'SOCIAL CULTURE', 'ON AIR', 'BEYOND THE SCREEN', 'STORIES THAT MATTER'];

export default function Expertises() {
  const { t } = useLang();

  const services = [
    { idx: '01', tag: tags[0], title: t('exp.s1.title'), desc: t('exp.s1.desc') },
    { idx: '02', tag: tags[1], title: t('exp.s2.title'), desc: t('exp.s2.desc') },
    { idx: '03', tag: tags[2], title: t('exp.s3.title'), desc: t('exp.s3.desc') },
    { idx: '04', tag: tags[3], title: t('exp.s4.title'), desc: t('exp.s4.desc') },
    { idx: '05', tag: tags[4], title: t('exp.s5.title'), desc: t('exp.s5.desc') },
    { idx: '06', tag: tags[5], title: t('exp.s6.title'), desc: t('exp.s6.desc') },
  ];

  return (
    <section id="expertises" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">{t('exp.eyebrow')}</p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              {t('exp.h2.1')}<br /><span className="text-muted-foreground">{t('exp.h2.2')}</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{t('exp.desc')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.idx} className="group p-6 md:p-8 rounded-lg border border-border/30 hover:border-primary/40 bg-card/50 hover:bg-card transition-all cursor-default">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium">{s.idx} / {s.tag}</span>
                <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
