import { useLang } from '../i18n';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border/30 pt-20 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-black text-sm">MH</span>
              <div className="leading-none">
                <p className="text-xs font-bold tracking-[0.15em]">MH ENTERTAINMENT</p>
                <p className="text-[10px] tracking-[0.3em] text-muted-foreground">R E C O R D S</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.desc.1')}<br />{t('footer.desc.2')}<br />{t('footer.desc.3')}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">{t('footer.col1')}</h4>
            <div className="space-y-2">
              <FL href="#maison">{t('footer.vision')}</FL>
              <FL href="#submit">{t('footer.forArtists')}</FL>
              <FL href="#submit">{t('footer.forLabels')}</FL>
              <FL href="#international">International</FL>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">{t('footer.col2')}</h4>
            <div className="space-y-2">
              <FL href="#expertises">{t('footer.expertises')}</FL>
              <FL href="#partners">{t('footer.media')}</FL>
              <FL href="#news">Journal</FL>
              <FL href="https://www.mhentertainment-records.com/contact" ext>Contact</FL>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">{t('footer.col3')}</h4>
            <div className="space-y-2">
              <FL href="https://www.mhentertainment-records.com/envoyer-un-projet" ext>{t('footer.submitProject')}</FL>
              <FL href="https://calendly.com/mhentertainment-shop/30min" ext>{t('footer.book')}</FL>
              <FL href="https://www.mhentertainment-shop.fr" ext>MH Entertainment Shop ↗</FL>
              <FL href="https://www.youtube.com/@MHENTERTAINMENT-SHOP" ext>YouTube MH ↗</FL>
            </div>
          </div>
        </div>
        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 MH ENTERTAINMENT RECORDS · INDEPENDENT SPIRIT. GLOBAL VISION.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">{t('footer.legal')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
        <p className="text-center mt-16 text-6xl sm:text-8xl font-black text-border/20 tracking-tight select-none" aria-hidden="true">MH. MUSIC FIRST.</p>
      </div>
    </footer>
  );
}

function FL({ href, children, ext }: { href: string; children: React.ReactNode; ext?: boolean }) {
  return (
    <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
      {children}
    </a>
  );
}
