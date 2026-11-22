import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { ADDRESS, LOCATIONS } from '../content';

export default function Locations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl font-bold">Locations</h1>
      <p className="mt-3 text-muted-foreground">Now Serving: Thunder Bay, Nipigon, Terrace Bay</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {LOCATIONS.map((l) => (
          <div key={l.name} className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold">{l.name}</h2>
            <ul className="mt-4 space-y-3">
              {l.venues.map((v) => (
                <li key={v} className="flex gap-2 text-sm"><MapPin className="h-4 w-4 shrink-0 text-primary" />{v}</li>
              ))}
            </ul>
            <Link to="/course" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">Browse Courses →</Link>
          </div>
        ))}
      </div>
      <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />Kanova Life — {ADDRESS}</p>
    </section>
  );
}
