import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@project/components/ui/input';
import { POSTS, type Post } from '../blog';

const fmt = (d: string) => format(new Date(d + 'T00:00:00'), 'MMM d, yyyy');

function Meta({ p }: { p: Post }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="font-semibold uppercase tracking-wide text-primary">{p.category}</span>
      <span>{fmt(p.date)}</span>
      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.readMins} min read</span>
    </div>
  );
}

function Card({ p }: { p: Post }) {
  return (
    <Link to={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={p.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Meta p={p} />
        <h3 className="font-display text-xl font-bold leading-snug group-hover:text-primary">{p.title}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
        <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-primary">Read more <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', ...new Set(POSTS.map((p) => p.category))];
  const list = useMemo(
    () => POSTS.filter((p) => (cat === 'All' || p.category === cat) && (p.title + p.excerpt).toLowerCase().includes(q.toLowerCase())),
    [q, cat],
  );
  const [featured, ...rest] = list;

  return (
    <div>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Kanova Life Blog</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">First aid tips & news</h1>
          <p className="mt-3 max-w-xl opacity-75">Practical safety advice, certification guidance and updates from our training team.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm transition ${cat === c ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary'}`}>{c}</button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="pl-9" />
          </div>
        </div>
        {!featured && <p className="py-16 text-center text-muted-foreground">No articles found.</p>}
        {featured && (
          <Link to={`/blog/${featured.slug}`} className="group mb-10 grid overflow-hidden rounded-2xl border bg-card md:grid-cols-2">
            <img src={featured.image} alt="" className="h-64 w-full object-cover md:h-full" />
            <div className="flex flex-col justify-center gap-4 p-8">
              <Meta p={featured} />
              <h2 className="font-display text-3xl font-bold group-hover:text-primary">{featured.title}</h2>
              <p className="text-muted-foreground">{featured.excerpt}</p>
              <span className="flex items-center gap-1 font-semibold text-primary">Read article <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => <Card key={p.slug} p={p} />)}
        </div>
      </div>
    </div>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return <p className="py-24 text-center">Article not found. <Link to="/blog" className="text-primary underline">Back to blog</Link></p>;
  const more = POSTS.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <article>
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl px-4 pb-40 pt-12 text-center md:px-8 md:pb-48">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm opacity-70 transition hover:text-primary hover:opacity-100">← Back to blog</Link>
          <span className="mx-auto mt-8 block w-fit rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">{p.category}</span>
          <h1 className="font-display mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">{p.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-75">{p.excerpt}</p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm opacity-70">
            <span>{fmt(p.date)}</span><span className="h-1 w-1 rounded-full bg-current" />
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{p.readMins} min read</span>
          </div>
        </div>
      </header>
      <div className="mx-auto -mt-32 max-w-5xl px-4 md:-mt-40 md:px-8">
        <img src={p.image} alt="" className="aspect-[16/8] w-full rounded-2xl object-cover shadow-2xl" />
      </div>
      <div className="mx-auto max-w-[680px] px-4 py-14 md:px-0">
        <div className="space-y-6 text-[17px] leading-8 text-foreground/85">
          {p.body.map((t, i) => (
            <p key={i} className={i === 0 ? 'text-xl leading-9 text-foreground first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-extrabold first-letter:leading-[0.9] first-letter:text-primary' : ''}>{t}</p>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border bg-card p-7 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-extrabold">Ready to get certified?</p>
            <p className="mt-1 text-sm text-muted-foreground">Book a Red Cross course near you in minutes.</p>
          </div>
          <Link to="/course" className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Browse courses <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <section className="border-t bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold md:text-3xl">More articles</h2>
            <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{more.map((x) => <Card key={x.slug} p={x} />)}</div>
        </div>
      </section>
    </article>
  );
}
