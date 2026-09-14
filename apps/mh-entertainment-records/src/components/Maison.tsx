import { ArrowRight } from 'lucide-react';

export default function Maison() {
  return (
    <section id="maison" className="py-24 md:py-36">
      <div className="rainbow-bar mb-24" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">
              01 / La maison
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              L'indépendance
              <br />
              comme point de départ.
              <br />
              <span className="text-muted-foreground">Le monde pour horizon.</span>
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Une chanson commence dans un univers singulier. Pour rencontrer son public, elle a besoin d'une direction, d'une image et d'un récit qui lui ressemblent.
            </p>
            <p>
              MH Entertainment Records est la vitrine musicale et institutionnelle de MH Entertainment. Elle réunit les approches de création, de promotion digitale et de communication médias.
            </p>
            <p>
              Pour les artistes indépendants, les labels et les structures musicales : une même exigence de cohérence, des chemins adaptés à chaque projet.
            </p>
            <a href="#submit" className="inline-flex items-center gap-2 text-primary font-bold text-sm mt-4 hover:opacity-80 transition-opacity">
              La vision MH <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          <a
            href="#submit"
            className="group p-8 md:p-10 rounded-lg border border-border/40 hover:border-primary/40 transition-all bg-card hover:bg-card/80"
          >
            <span className="text-[10px] tracking-[0.25em] text-primary font-bold uppercase">ARTISTS FIRST</span>
            <h3 className="text-2xl font-bold mt-4 mb-3 group-hover:text-primary transition-colors">
              Votre musique.
              <br />
              Votre prochaine étape.
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Créer une présence à la hauteur de votre identité artistique.
            </p>
            <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Soumettre <ArrowRight size={14} />
            </span>
          </a>

          <a
            href="#submit"
            className="group p-8 md:p-10 rounded-lg border border-border/40 hover:border-primary/40 transition-all bg-card hover:bg-card/80"
          >
            <span className="text-[10px] tracking-[0.25em] text-primary font-bold uppercase">LABELS & MUSIC COMPANIES</span>
            <h3 className="text-2xl font-bold mt-4 mb-3 group-hover:text-primary transition-colors">
              Votre vision.
              <br />
              De nouvelles perspectives.
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Des approches complémentaires pour accompagner vos projets et vos équipes.
            </p>
            <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              En savoir plus <ArrowRight size={14} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
