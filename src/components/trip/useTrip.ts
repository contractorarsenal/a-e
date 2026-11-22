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
