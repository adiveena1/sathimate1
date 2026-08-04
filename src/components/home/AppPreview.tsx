'use client';

import { Calendar, MapPin, Star, Users } from 'lucide-react';
import { useT } from '@/lib/i18n/provider';

/**
 * Landing page par pehle yahan khaali gradient boxes the — ek bada icon aur
 * "Search & Connect with Travelers" jaisa label. Aadhi screen kuch keh hi nahi
 * rahi thi, aur unfinished lagti thi.
 *
 * Ab yahan product ka asli UI dikhta hai. Landing page ka sabse bada kaam yehi
 * hai: banda dekhe ki andar kya milega. Airbnb, Linear, Notion — sab yahi
 * karte hain.
 *
 * Ye sirf illustration hai, live data nahi. Isliye har panel par "Sample view"
 * likha hai — taaki koi ise asli users na samjhe.
 */

function PanelFrame({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <div className="relative rounded-3xl border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)] sm:p-5">
      <span className="absolute -top-2.5 right-5 rounded-full border bg-background px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {t('preview.sample')}
      </span>
      {children}
    </div>
  );
}

function Initial({ letter, tone }: { letter: string; tone: string }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${tone}`}
    >
      {letter}
    </div>
  );
}

/* ---------------- 1. Discovery ---------------- */

const people = [
  { letter: 'R', name: 'Rohit, 22', line: 'Manali · 12–16 Mar', tags: ['Budget', 'Trekking'], tone: 'bg-primary/15 text-primary' },
  { letter: 'S', name: 'Sana, 24', line: 'Manali · 12–17 Mar', tags: ['Women-only', 'Photography'], tone: 'bg-accent/20 text-accent-foreground' },
  { letter: 'K', name: 'Karan, 26', line: 'Manali · 13–16 Mar', tags: ['Backpacking'], tone: 'bg-secondary text-secondary-foreground' },
];

export function DiscoveryPreview() {
  const t = useT();
  return (
    <PanelFrame>
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        Manali · March
      </div>

      <div className="space-y-2.5">
        {people.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-accent/50"
          >
            <Initial letter={p.letter} tone={p.tone} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.line}</p>
            </div>
            <div className="hidden shrink-0 gap-1.5 sm:flex">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelFrame>
  );
}

/* ---------------- 2. Planning ---------------- */

export function PlanningPreview() {
  const t = useT();
  return (
    <PanelFrame>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-headline text-lg font-bold">Manali Backpackers</p>
          <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> 12–16 Mar
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> 4 / 6
            </span>
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          {t('preview.open')}
        </span>
      </div>

      <div className="mb-4 space-y-2">
        {[
          ['Bus + hostel', '₹4,200'],
          ['Solang Valley', '₹1,100'],
          ['Food', '₹2,000'],
        ].map(([label, amount]) => (
          <div key={label} className="flex justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{amount}</span>
          </div>
        ))}
        <div className="flex justify-between px-3 pt-1 text-sm font-semibold">
          <span>{t('preview.perhead')}</span>
          <span>₹7,300</span>
        </div>
      </div>

      <div className="space-y-2 border-t pt-3">
        <div className="flex gap-2">
          <Initial letter="S" tone="bg-accent/20 text-accent-foreground" />
          <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
            Bus leaves at 9pm — everyone reach ISBT by 8:30
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}

/* ---------------- 3. Exploration ---------------- */

export function ExplorationPreview() {
  const t = useT();
  return (
    <PanelFrame>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">{t('preview.nearby.title')}</p>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {t('preview.live')}
        </span>
      </div>

      <div className="space-y-2.5">
        {[
          { letter: 'A', name: 'Aman', line: '1.2 km · Rishikesh', tone: 'bg-primary/15 text-primary' },
          { letter: 'P', name: 'Priya', line: '3.4 km · Rishikesh', tone: 'bg-accent/20 text-accent-foreground' },
          { letter: 'V', name: 'Vikram', line: '5.8 km · Rishikesh', tone: 'bg-secondary text-secondary-foreground' },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-3 rounded-xl border p-3">
            <Initial letter={p.letter} tone={p.tone} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.line}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              4.8
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {t('preview.location.note')}
      </p>
    </PanelFrame>
  );
}
