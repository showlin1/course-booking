import { ArrowRight } from 'lucide-react';

const regions = ['Europe', 'Amériques', 'Caraïbes & Outre-mer', 'Afrique', 'Asie & Océanie'];

export default function GlobalVision() {
  return (
    <section id="international" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="https://images.fillout.com/826458/kavdatwhwc/generated-images/mvsPj5ZqBNAUYexwHtD4sE/img_tHBVsdxt00yfviO2.jpg"
              alt="Vision internationale MH Entertainment"
              className="w-full rounded-xl"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/60 to-transparent" />
            <p className="absolute bottom-6 left-6 text-[10px] tracking-[0.25em] text-primary/80 font-bold uppercase">
              INDEPENDENT SPIRIT / GLOBAL VISION
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">
              04 / Vision internationale
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Des cultures différentes.
              <br />
              <span className="text-muted-foreground">Une même énergie.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Penser au-delà d'un seul territoire, sans parler à tous de la même manière. Une ouverture internationale se construit autour des langues, des esthétiques et des publics.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {regions.map((r) => (
                <span
                  key={r}
                  className="px-4 py-2 text-xs font-medium border border-border/50 rounded-full text-muted-foreground"
                >
                  {r}
                </span>
              ))}
            </div>
            <a href="#submit" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:opacity-80 transition-opacity">
              Notre approche internationale <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
