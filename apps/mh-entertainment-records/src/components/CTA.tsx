import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section id="contact" className="py-24 md:py-36">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">
          La suite s'écrit ensemble
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Votre ambition.
          <br />
          <span className="text-muted-foreground">Notre prochaine conversation.</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a
            href="https://www.mhentertainment-records.com/envoyer-un-projet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-md hover:opacity-90 transition-opacity"
          >
            Présenter mon projet <ArrowRight size={16} />
          </a>
          <a
            href="https://calendly.com/mhentertainment-shop/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-bold rounded-md hover:bg-secondary transition-colors"
          >
            Prendre rendez-vous <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
