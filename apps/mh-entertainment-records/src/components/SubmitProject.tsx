import { ArrowRight, Music, Radio, Tv } from 'lucide-react';

export default function SubmitProject() {
  return (
    <section id="submit" className="py-24 md:py-36">
      <div className="rainbow-bar mb-24" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">
            03 / Présentez votre projet
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Votre ambition.
            <br />
            <span className="text-gradient">Notre prochaine conversation.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Trois voies d'accès pour soumettre votre musique au label, à la radio ou à la télévision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SubmitCard
            icon={<Music size={28} />}
            title="Soumettre mon projet au label"
            desc="Partagez votre musique, votre identité et la prochaine étape que vous souhaitez construire avec MH Entertainment Records."
            cta="Envoyer mon projet"
            href="https://www.mhentertainment-records.com/envoyer-un-projet"
          />
          <SubmitCard
            icon={<Radio size={28} />}
            title="Soumission single radio"
            desc="Proposez votre single pour une diffusion radio. Nous sélectionnons les projets adaptés aux programmations nationales et internationales."
            cta="Soumettre en radio"
            href="https://www.mhentertainment-records.com/envoyer-un-projet?objet=radio"
          />
          <SubmitCard
            icon={<Tv size={28} />}
            title="Soumission clip TV"
            desc="Envoyez votre clip pour une diffusion sur les chaînes musicales TV. Qualité d'image et narration visuelle exigées."
            cta="Soumettre en TV"
            href="https://www.mhentertainment-records.com/envoyer-un-projet?objet=tv"
          />
        </div>
      </div>
    </section>
  );
}

function SubmitCard({ icon, title, desc, cta, href }: { icon: React.ReactNode; title: string; desc: string; cta: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col p-8 md:p-10 rounded-lg border border-border/40 hover:border-primary/50 bg-card hover:bg-card/80 transition-all"
    >
      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">{desc}</p>
      <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
        {cta} <ArrowRight size={14} />
      </span>
    </a>
  );
}
