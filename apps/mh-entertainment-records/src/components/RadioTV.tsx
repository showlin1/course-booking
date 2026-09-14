import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';

export default function RadioTV() {
  const { t } = useLang();
  return (
    <section className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative rounded-xl overflow-hidden group">
            <img src="https://images.fillout.com/826458/kavdatwhwc/generated-images/aFHsUkahKEWn8StwLGBhmA/img_qO7HavTIQBz-g6km.jpg" alt="Radio studio" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-[10px] tracking-[0.25em] text-primary font-bold uppercase">RADIO SINGLE</span>
              <h3 className="text-2xl font-bold mt-2 mb-2">{t('radiotv.radio.title')}</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">{t('radiotv.radio.desc')}</p>
              <a href="https://www.mhentertainment-records.com/envoyer-un-projet?objet=radio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
                {t('radiotv.radio.cta')} <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden group">
            <img src="https://images.fillout.com/826458/kavdatwhwc/generated-images/vwQKGZm2zdZty2byhzcjKq/img_h7lXU6G_-MXdofCz.jpg" alt="TV production studio" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-[10px] tracking-[0.25em] text-primary font-bold uppercase">MUSIC VIDEO</span>
              <h3 className="text-2xl font-bold mt-2 mb-2">{t('radiotv.tv.title')}</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">{t('radiotv.tv.desc')}</p>
              <a href="https://www.mhentertainment-records.com/envoyer-un-projet?objet=tv" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
                {t('radiotv.tv.cta')} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
