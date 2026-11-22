import type { ConciergeData, TripState } from './types';
import { money, nightsBetween, num } from './format';

type Props = { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void };

const F = ({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string; value: string; onChange: (v: string) => void }) => (
  <label htmlFor={id} className="block">
    <span className="label">{label}</span>
    <div className="flex items-baseline gap-1"><span className="text-taupe" aria-hidden>$</span><input id={id} className="field" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, '').slice(0, 9))} placeholder="0" /></div>
    {hint && <span className="text-xs text-taupe">{hint}</span>}
  </label>
);

export default function Budget({ trip, update }: Props) {
  const b = trip.budget;
  const set = (patch: Partial<TripState['budget']>) => update({ budget: { ...b, ...patch } });
  const nights = nightsBetween(trip.checkin, trip.checkout);
  const rooms = Math.max(1, Math.round(b.rooms) || 1);
  const hotel = rooms * nights * num(b.hotelNight);
  const rental = nights * num(b.rentalNight);
  const transport = trip.transport === 'rideshare' ? num(b.rideTotal) : trip.transport === 'rental' ? num(b.carTotal) : 0;
  const other = num(b.otherTotal);
  const totalHotel = hotel + transport + other;
  const totalRental = rental + transport + other;
  const party = Math.max(1, trip.party);
  const hasHotel = num(b.hotelNight) > 0, hasRental = num(b.rentalNight) > 0;

  return (
    <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="max-w-md text-taupe">Everything here is <strong className="font-medium text-charcoal">a number you enter</strong>. We don’t know current rates, airfare or taxes, so we never fill them in for you. Check real prices with the hotel or booking site, then type them in.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2 text-sm text-taupe">Travelers: <b className="font-medium text-charcoal">{party}</b> · Nights: <b className="font-medium text-charcoal">{nights}</b> <span>(change both in the planner)</span></div>
          <label className="block"><span className="label">Hotel rooms needed</span><input className="field" type="number" min={1} max={10} value={b.rooms} onChange={(e) => set({ rooms: Number(e.target.value) })} /></label>
          <F id="b-hotel" label="Hotel price per night (per room)" hint="Include taxes if you know them" value={b.hotelNight} onChange={(v) => set({ hotelNight: v })} />
          <F id="b-rental" label="Shared rental price per night" hint="Whole home, including fees" value={b.rentalNight} onChange={(v) => set({ rentalNight: v })} />
          <F id="b-car" label="Rental car, total" hint="For the whole trip" value={b.carTotal} onChange={(v) => set({ carTotal: v })} />
          <F id="b-ride" label="Rideshare, total" hint="Your own estimate" value={b.rideTotal} onChange={(v) => set({ rideTotal: v })} />
          <F id="b-other" label="Other (parking, food, airfare…)" value={b.otherTotal} onChange={(v) => set({ otherTotal: v })} />
        </div>
        <p className="mt-6 text-xs text-taupe">Transport used: <b className="font-medium">{trip.transport === 'rental' ? 'rental car' : trip.transport === 'rideshare' ? 'rideshare' : 'ride coordinated with guests (no cost counted)'}</b>, from your planner choice.</p>
      </div>

      <div aria-live="polite" className="border border-charcoal/15 bg-paper p-6 md:p-8">
        <p className="eyebrow">Your estimate</p>
        <p className="mt-1 text-xs text-taupe">Based only on the values you entered.</p>
        {[
          { name: 'Hotel stay', show: hasHotel, total: totalHotel, lines: [['Rooms', hotel], ['Transportation', transport], ['Other', other]] as const },
          { name: 'Shared rental', show: hasRental, total: totalRental, lines: [['Accommodation', rental], ['Transportation', transport], ['Other', other]] as const },
        ].map((s) => (
          <div key={s.name} className="mt-6 border-t border-charcoal/12 pt-6">
            <h3 className="display text-2xl">{s.name}</h3>
            {s.show ? (<>
              <dl className="mt-3 space-y-1 text-sm">{s.lines.map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-taupe">{k}</dt><dd>{money(v)}</dd></div>)}</dl>
              <p className="mt-4 flex items-baseline justify-between"><span className="label">Total</span><span className="display text-4xl">{money(s.total)}</span></p>
              <p className="flex items-baseline justify-between text-sm"><span className="text-taupe">Per person ({party})</span><span>{money(s.total / party)}</span></p>
            </>) : <p className="mt-2 text-sm text-taupe">Enter a nightly price to see this.</p>}
          </div>
        ))}
        {hasHotel && hasRental && (
          <p className="mt-6 border-t border-charcoal/12 pt-5 text-sm">
            With your numbers, the {totalRental < totalHotel ? 'shared rental' : 'hotel'} comes out <b>{money(Math.abs(totalHotel - totalRental))}</b> lower overall ({money(Math.abs(totalHotel - totalRental) / party)} per person).
          </p>
        )}
      </div>
    </div>
  );
}
