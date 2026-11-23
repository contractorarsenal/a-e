import { useEffect, useState } from 'react';
import { defaultTrip, type ConciergeData, type TripState } from './types';

const KEY = 'ae-trip-v1';
/** Preferences are kept in this browser only (localStorage). Nothing is sent to a server or synced between devices. */
export function useTrip(data: ConciergeData) {
  const [trip, setTrip] = useState<TripState>(() => defaultTrip(data));
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setTrip({ ...defaultTrip(data), ...s, budget: { ...defaultTrip(data).budget, ...(s.budget ?? {}) } });
        setSaved(true);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(trip)); setSaved(true); } catch { setSaved(false); }
  }, [trip, ready]);
  const update = (patch: Partial<TripState>) => setTrip((t) => ({ ...t, ...patch }));
  const reset = () => { try { localStorage.removeItem(KEY); } catch {} setTrip(defaultTrip(data)); setSaved(false); };
  return { trip, update, reset, saved };
}

export type Tab = 'stay' | 'plan' | 'budget';
export type Ui = { tab: Tab; step: number; done: boolean };
const UI_KEY = 'ae-trip-ui';
/** Which tab / planner step is showing. Kept per browser tab (sessionStorage) so switching language lands on the same step. */
export function useUi() {
  const [ui, setUi] = useState<Ui>({ tab: 'stay', step: 0, done: false });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const r = sessionStorage.getItem(UI_KEY); if (r) setUi((u) => ({ ...u, ...JSON.parse(r) })); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { sessionStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch {} }, [ui, ready]);
  return [ui, (p: Partial<Ui>) => setUi((u) => ({ ...u, ...p }))] as const;
}
