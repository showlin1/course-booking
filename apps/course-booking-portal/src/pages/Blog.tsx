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
      <div className="mx-auto max-w-3xl px-4 pt-10 md:px-8">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">← Back to blog</Link>
        <div className="mt-6"><Meta p={p} /></div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">{p.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{p.excerpt}</p>
      </div>
      <img src={p.image} alt="" className="mx-auto mt-8 aspect-[21/9] w-full max-w-5xl object-cover md:rounded-2xl" />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-10 text-lg leading-relaxed md:px-8">
        {p.body.map((t, i) => <p key={i}>{t}</p>)}
        <div className="!mt-10 rounded-xl bg-primary/10 p-6">
          <p className="font-display text-xl font-bold">Ready to get certified?</p>
          <Link to="/course" className="mt-3 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Browse courses</Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-6 font-display text-2xl font-bold">More articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{more.map((x) => <Card key={x.slug} p={x} />)}</div>
      </div>
    </article>
  );
}
