import { Play } from 'lucide-react';
import { useLang } from '../i18n';

export default function GlobalPower() {
  const { t } = useLang();
  return (
    <section className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="relative rounded-xl overflow-hidden">
          <img src="https://images.fillout.com/826458/kavdatwhwc/generated-images/189GYm4Nm4ZKgHf514dJRY/img_lJut3XZKFfWmrMU7.jpg" alt="MH Entertainment GLOBAL POWER" className="w-full h-[480px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <a href="https://www.youtube.com/watch?v=hlbXhTdzZAc" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center group" aria-label="Play GLOBAL POWER video">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={28} className="text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </a>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-3">MH IN MOTION</p>
            <h2 className="text-4xl sm:text-5xl font-bold">GLOBAL <span className="text-gradient">POWER.</span></h2>
            <p className="text-muted-foreground mt-3 max-w-md">{t('gp.desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
