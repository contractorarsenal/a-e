import { useRef } from 'react';
import HotelExplorer from './HotelExplorer';
import Planner from './Planner';
import Budget from './Budget';
import type { ConciergeData } from './types';
import { useTrip, useUi, type Tab } from './useTrip';
import { I18nProvider } from './i18n';

export default function TripConcierge({ data }: { data: ConciergeData }) {
  return (
    <I18nProvider lang={data.lang} t={data.t} newTab={data.newTab}>
      <Concierge data={data} />
    </I18nProvider>
  );
}

function Concierge({ data }: { data: ConciergeData }) {
  const t = data.t;
  const { trip, update, reset, saved } = useTrip(data);
  const [ui, setUi] = useUi();
  const tab = ui.tab;
  const top = useRef<HTMLDivElement>(null);
  const TABS = [
    { id: 'stay', label: t.tabStay },
    { id: 'plan', label: t.tabPlan },
    { id: 'budget', label: t.tabBudget },
  ] as const;
  const setTab = (id: Tab) => setUi({ tab: id });
  const go = (id: Tab) => { setTab(id); top.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[n].id); document.getElementById(`tab-${TABS[n].id}`)?.focus();
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <div role="tablist" aria-label={t.tabsLabel} className="mx-auto mb-12 grid max-w-3xl grid-cols-1 border-b border-charcoal/20 sm:grid-cols-3">
        {TABS.map((x, i) => (
          <button key={x.id} id={`tab-${x.id}`} role="tab" aria-selected={tab === x.id} aria-controls={`panel-${x.id}`} tabIndex={tab === x.id ? 0 : -1}
            onClick={() => setTab(x.id)} onKeyDown={(e) => onKey(e, i)}
            className="-mb-px min-h-[3.25rem] border-b-[3px] border-transparent px-3 py-2 text-[1.0625rem] font-semibold text-taupe transition-colors hover:text-charcoal aria-selected:border-clay aria-selected:text-charcoal">{x.label}</button>
        ))}
      </div>
      <div role="tabpanel" id="panel-stay" aria-labelledby="tab-stay" hidden={tab !== 'stay'}>
        {tab === 'stay' && <HotelExplorer data={data} trip={trip} update={update} goPlan={() => go('plan')} />}
      </div>
      <div role="tabpanel" id="panel-plan" aria-labelledby="tab-plan" hidden={tab !== 'plan'}>
        {tab === 'plan' && <Planner data={data} trip={trip} update={update} reset={reset} saved={saved} goStay={() => go('stay')} step={ui.step} done={ui.done} setStep={(step) => setUi({ step })} setDone={(done) => setUi({ done })} />}
      </div>
      <div role="tabpanel" id="panel-budget" aria-labelledby="tab-budget" hidden={tab !== 'budget'}>
        {tab === 'budget' && <Budget data={data} trip={trip} update={update} />}
      </div>
    </div>
  );
}
