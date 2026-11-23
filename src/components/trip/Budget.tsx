import type { ConciergeData, TripState } from './types';
import { num } from './format';
import { useI18n, rich } from './i18n';

type Props = { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void };

const F = ({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string; value: string; onChange: (v: string) => void }) => (
  <label htmlFor={id} className="block">
    <span className="label">{label}</span>
    <div className="flex items-center gap-2"><span className="mt-1.5 text-taupe" aria-hidden>$</span><input id={id} className="field" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, '').slice(0, 9))} placeholder="0" /></div>
    {hint && <span className="text-sm text-taupe">{hint}</span>}
  </label>
);

export default function Budget({ trip, update }: Props) {
  const { t, fmt, money, nights: nightsBetween } = useI18n();
  const b = trip.budget, tb = t.budget;
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
  const what = trip.transport === 'rental' ? tb.tRental : trip.transport === 'rideshare' ? tb.tRideshare : tb.tCoordinate;
  const diff = Math.abs(totalHotel - totalRental);
  const cheaperKey = totalRental < totalHotel ? 'cheaperRental' : 'cheaperHotel';

  return (
    <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="max-w-md text-taupe">{rich(tb.intro, { strong: <strong className="font-semibold text-charcoal">{tb.introStrong}</strong> })}</p>
        <p className="mt-2 max-w-md text-taupe">{tb.currency}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <p className="text-taupe sm:col-span-2">{fmt(tb.travelersNights, { party, nights })}</p>
          <label className="block"><span className="label">{tb.rooms}</span><input className="field" type="number" min={1} max={10} value={b.rooms} onChange={(e) => set({ rooms: Number(e.target.value) })} /></label>
          <F id="b-hotel" label={tb.hotelNight} hint={tb.hotelHint} value={b.hotelNight} onChange={(v) => set({ hotelNight: v })} />
          <F id="b-rental" label={tb.rentalNight} hint={tb.rentalHint} value={b.rentalNight} onChange={(v) => set({ rentalNight: v })} />
          <F id="b-car" label={tb.car} hint={tb.carHint} value={b.carTotal} onChange={(v) => set({ carTotal: v })} />
          <F id="b-ride" label={tb.ride} hint={tb.rideHint} value={b.rideTotal} onChange={(v) => set({ rideTotal: v })} />
          <F id="b-other" label={tb.other} value={b.otherTotal} onChange={(v) => set({ otherTotal: v })} />
        </div>
        <p className="mt-6 text-taupe">{fmt(tb.transportUsed, { what })}</p>
      </div>

      <div aria-live="polite" className="border border-charcoal/20 bg-paper p-6 md:p-8">
        <p className="heading text-xl">{tb.estimate}</p>
        <p className="mt-1 text-taupe">{tb.basedOn}</p>
        {[
          { name: tb.hotelStay, show: hasHotel, total: totalHotel, lines: [[tb.rowRooms, hotel], [tb.rowTransport, transport], [tb.rowOther, other]] as const },
          { name: tb.sharedRental, show: hasRental, total: totalRental, lines: [[tb.rowAccom, rental], [tb.rowTransport, transport], [tb.rowOther, other]] as const },
        ].map((s) => (
          <div key={s.name} className="mt-6 border-t border-charcoal/15 pt-6">
            <h3 className="heading text-xl">{s.name}</h3>
            {s.show ? (<>
              <dl className="mt-3 space-y-1">{s.lines.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-taupe">{k}</dt><dd>{money(v)}</dd></div>)}</dl>
              <p className="mt-4 flex items-baseline justify-between gap-4"><span className="label">{tb.total}</span><span className="h2">{money(s.total)}</span></p>
              <p className="flex items-baseline justify-between gap-4"><span className="text-taupe">{fmt(tb.perPerson, { n: party })}</span><span>{money(s.total / party)}</span></p>
            </>) : <p className="mt-2 text-taupe">{tb.enterNightly}</p>}
          </div>
        ))}
        {hasHotel && hasRental && (
          <p className="mt-6 border-t border-charcoal/15 pt-5 font-semibold">{fmt(tb[cheaperKey], { amount: money(diff), per: money(diff / party) })}</p>
        )}
      </div>
    </div>
  );
}
