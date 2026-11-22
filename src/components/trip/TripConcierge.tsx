import { useRef, useState } from 'react';
import HotelExplorer from './HotelExplorer';
import Planner from './Planner';
import Budget from './Budget';
import type { ConciergeData } from './types';
import { useTrip } from './useTrip';

const TABS = [
  { id: 'stay', label: 'Hotels & map' },
  { id: 'plan', label: 'Trip planner' },
  { id: 'budget', label: 'Trip budget' },
] as const;
type Tab = (typeof TABS)[number]['id'];

export default function TripConcierge({ data }: { data: ConciergeData }) {
  const { trip, update, reset, saved } = useTrip(data);
  const [tab, setTab] = useState<Tab>('stay');
  const top = useRef<HTMLDivElement>(null);
  const go = (t: Tab) => { setTab(t); top.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[n].id); document.getElementById(`tab-${TABS[n].id}`)?.focus();
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <div role="tablist" aria-label="Plan your trip" className="mx-auto mb-12 grid max-w-2xl grid-cols-3 border-b border-charcoal/15">
        {TABS.map((t, i) => (
          <button key={t.id} id={`tab-${t.id}`} role="tab" aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}
            className="-mb-px min-h-[3.25rem] border-b-2 border-transparent px-2 text-[.7rem] uppercase tracking-[.18em] text-taupe transition-colors hover:text-charcoal aria-selected:border-charcoal aria-selected:text-charcoal sm:text-xs sm:tracking-[.24em]">{t.label}</button>
        ))}
      </div>
      <div role="tabpanel" id="panel-stay" aria-labelledby="tab-stay" hidden={tab !== 'stay'}>
        {tab === 'stay' && <HotelExplorer data={data} trip={trip} update={update} goPlan={() => go('plan')} />}
      </div>
      <div role="tabpanel" id="panel-plan" aria-labelledby="tab-plan" hidden={tab !== 'plan'}>
        {tab === 'plan' && <Planner data={data} trip={trip} update={update} reset={reset} saved={saved} goStay={() => go('stay')} />}
      </div>
      <div role="tabpanel" id="panel-budget" aria-labelledby="tab-budget" hidden={tab !== 'budget'}>
        {tab === 'budget' && <Budget data={data} trip={trip} update={update} />}
      </div>
    </div>
  );
}
