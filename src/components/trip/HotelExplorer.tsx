import { useState } from 'react';
import MapView from './MapView';
import type { ConciergeData, HotelData, TripState } from './types';
import { dur, mi, fmtDate } from './format';

type Props = { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void; goPlan: () => void };

function Photo({ h }: { h: HotelData }) {
  if (h.photo) return <img src={h.photo} alt={`${h.name} exterior`} className="h-full w-full object-cover" loading="lazy" />;
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-champagne/70 to-sand/40 text-center">
      <div>
        <p className="font-display text-3xl italic text-charcoal/70">{h.area}</p>
        <p className="eyebrow mt-2 !text-[.6rem]">Photos on the hotel’s own site</p>
      </div>
    </div>
  );
}

export default function HotelExplorer({ data, trip, update, goPlan }: Props) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [airRoute, setAirRoute] = useState(false);
  const selected = data.hotels.find((h) => h.id === trip.hotelId) ?? null;
  const airport = data.airports.find((a) => a.code === trip.airport) ?? data.airports[0];

  const select = (id: string) => {
    update({ hotelId: id });
    requestAnimationFrame(() => document.getElementById(`hotel-${id}`)?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  };
  const toggleCompare = (id: string) => {
    const has = trip.compare.includes(id);
    if (!has && trip.compare.length >= 3) return;
    update({ compare: has ? trip.compare.filter((x) => x !== id) : [...trip.compare, id] });
  };

  const route = (h: HotelData) => ({ ...h.toVenue, label: 'Approx. · typical conditions' });

  return (
    <div>
      {/* airport chooser */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="label">Distances from</span>
        <div role="group" aria-label="Choose an airport" className="flex flex-wrap gap-2">
          {data.airports.map((a) => (
            <button key={a.code} type="button" aria-pressed={trip.airport === a.code} onClick={() => update({ airport: a.code })}
              className="min-h-11 border border-charcoal/25 px-4 text-[.72rem] uppercase tracking-[.2em] transition-colors aria-pressed:border-charcoal aria-pressed:bg-charcoal aria-pressed:text-ivory">{a.code}</button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm text-taupe">
          <input type="checkbox" checked={airRoute} onChange={(e) => setAirRoute(e.target.checked)} className="h-4 w-4 accent-[#9a4a31]" />
          Show {airport.code} route on map
        </label>
      </div>

      {/* mobile toggle */}
      <div role="tablist" aria-label="Map or list" className="mb-4 grid grid-cols-2 border border-charcoal/25 lg:hidden">
        {(['map', 'list'] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className="min-h-11 text-[.72rem] uppercase tracking-[.22em] aria-selected:bg-charcoal aria-selected:text-ivory">{v === 'map' ? 'Map' : 'List'}</button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        {/* LIST */}
        <ol aria-label="Hotels" className={`${view === 'list' ? 'block' : 'hidden'} space-y-3 lg:order-1 lg:block`}>
          {data.hotels.map((h, i) => {
            const isSel = h.id === trip.hotelId;
            const r = route(h);
            const fa = h.fromAirport[airport.code];
            const inCompare = trip.compare.includes(h.id);
            return (
              <li key={h.id} id={`hotel-${h.id}`} className={`border bg-paper transition-colors ${isSel ? 'border-charcoal' : 'border-charcoal/15'}`}>
                <button type="button" onClick={() => select(h.id)} aria-expanded={isSel} className="flex w-full items-start gap-4 p-4 text-left md:p-5">
                  <span aria-hidden className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm ${isSel ? 'bg-clay text-ivory' : 'bg-charcoal text-ivory'}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block !text-[.62rem]">{h.tier} · {h.area}</span>
                    <span className="display mt-1 block text-[1.45rem] leading-tight">{h.name}</span>
                    <span className="mt-2 block text-sm text-taupe">{mi(r.miles)} · about {dur(r.minutes)} to {data.venue.name}</span>
                  </span>
                  <span aria-hidden className={`mt-2 text-xl transition-transform ${isSel ? 'rotate-45' : ''}`}>+</span>
                </button>

                {isSel && (
                  <div className="border-t border-charcoal/10 p-4 md:p-5">
                    <div className="aspect-[16/8] overflow-hidden"><Photo h={h} /></div>
                    <p className="mt-4 text-[.95rem]">{h.why}</p>
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                      <div><dt className="label !text-[.6rem]">To {data.venue.name}</dt><dd className="mt-1 font-display text-2xl">{mi(r.miles)}<span className="text-base text-taupe"> · {dur(r.minutes)}</span></dd><dd className="text-xs text-taupe">{r.label}</dd></div>
                      <div><dt className="label !text-[.6rem]">From {airport.code}</dt><dd className="mt-1 font-display text-2xl">{fa ? mi(fa.miles) : '—'}<span className="text-base text-taupe">{fa ? ` · ${dur(fa.minutes)}` : ''}</span></dd><dd className="text-xs text-taupe">Approx. · typical conditions</dd></div>
                    </dl>
                    <p className="mt-4 text-sm"><span className="label !text-[.6rem]">Address</span><br />{h.address}</p>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Amenities">
                      {h.amenities.map((a) => <li key={a} className="border border-charcoal/15 px-3 py-1 text-xs">{a}</li>)}
                    </ul>
                    <p className="mt-2 text-xs text-taupe">Amenities as reported for this property. Please confirm details on the hotel’s own page.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <a className="btn btn-solid" href={h.bookingUrl} target="_blank" rel="noopener noreferrer">Book on hotel site ↗</a>
                      <a className="btn" href={h.googleDirections} target="_blank" rel="noopener noreferrer">Directions · Google ↗</a>
                      <a className="btn" href={h.appleDirections} target="_blank" rel="noopener noreferrer">Directions · Apple ↗</a>
                      <button type="button" className="btn" aria-pressed={inCompare} onClick={() => toggleCompare(h.id)} disabled={!inCompare && trip.compare.length >= 3}>{inCompare ? '✓ In comparison' : 'Add to compare'}</button>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-taupe">
                      Booking links open the hotel’s official website in a new tab. Nothing is reserved until you complete a booking there, and this site never takes payments.
                      {' '}Your dates ({fmtDate(trip.checkin)} – {fmtDate(trip.checkout)}) are not passed to the hotel, so choose them on its page.
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* MAP */}
        <div className={`${view === 'map' ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:order-2 lg:block`}>
          <div className="h-[60svh] min-h-[22rem] border border-charcoal/15 lg:h-[34rem]">
            <MapView data={data} selectedId={trip.hotelId} airport={trip.airport} showAirportRoute={airRoute} onSelect={select} />
          </div>
          <p className="mt-3 text-xs text-taupe">
            Distances and routes are approximate, calculated from road data ({data.routeMeta.provider}, {data.routeMeta.date}). {data.routeMeta.note}
            {' '}Pins are placed from street addresses and may be slightly off.
          </p>
          {selected && view === 'map' && (() => { const r = route(selected); return (
            <div className="mt-4 border border-charcoal bg-paper p-4 lg:hidden" aria-live="polite">
              <p className="eyebrow !text-[.62rem]">{selected.tier}</p>
              <p className="display mt-1 text-2xl leading-tight">{selected.name}</p>
              <p className="mt-1 text-sm text-taupe">{mi(r.miles)} · about {dur(r.minutes)} to {data.venue.name}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a className="btn btn-solid !px-3" href={selected.bookingUrl} target="_blank" rel="noopener noreferrer">Book hotel ↗</a>
                <a className="btn !px-3" href={selected.googleDirections} target="_blank" rel="noopener noreferrer">Directions ↗</a>
              </div>
              <button type="button" className="link tap mt-3 text-sm" onClick={() => setView('list')}>See details &amp; amenities →</button>
            </div>); })()}
        </div>
      </div>

      {trip.compare.length >= 2 && <Compare data={data} trip={trip} update={update} />}
      {selected && (
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-solid" onClick={goPlan}>Use {selected.name.split(' ')[0]} in my trip plan →</button>
        </div>
      )}
    </div>
  );
}

function Compare({ data, trip, update }: { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void }) {
  const hs = trip.compare.map((id) => data.hotels.find((h) => h.id === id)!).filter(Boolean);
  const ap = trip.airport;
  const rows: { label: string; get: (h: HotelData) => string }[] = [
    { label: 'Distance to the wedding', get: (h) => mi(h.toVenue.miles) },
    { label: 'Estimated drive', get: (h) => `${dur(h.toVenue.minutes)} (typical conditions)` },
    { label: `From ${ap}`, get: (h) => (h.fromAirport[ap] ? `${mi(h.fromAirport[ap].miles)} · ${dur(h.fromAirport[ap].minutes)}` : '—') },
    { label: 'Family suitability', get: (h) => h.family },
    { label: 'Rooms & suites', get: (h) => h.roomTypes },
    { label: 'Kitchen', get: (h) => h.kitchen },
    { label: 'Parking', get: (h) => h.parking },
  ];
  return (
    <section aria-labelledby="cmp" className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <h3 id="cmp" className="display text-4xl">Side by side</h3>
        <button type="button" className="link text-sm" onClick={() => update({ compare: [] })}>Clear</button>
      </div>
      <p className="mt-2 text-sm text-taupe">Nightly prices and availability are not shown. Check the hotel’s own site for your dates.</p>
      {/* desktop table */}
      <div className="mt-6 hidden md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Hotel comparison</caption>
          <thead><tr><td />{hs.map((h) => <th key={h.id} scope="col" className="display border-b border-charcoal/20 pb-3 pr-4 align-bottom text-xl font-normal">{h.name}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-charcoal/10 align-top">
                <th scope="row" className="label w-40 py-4 pr-4 !text-[.62rem]">{r.label}</th>
                {hs.map((h) => <td key={h.id} className="py-4 pr-4">{r.get(h)}</td>)}
              </tr>
            ))}
            <tr><th scope="row" className="label py-4 !text-[.62rem]">Booking</th>{hs.map((h) => <td key={h.id} className="py-4 pr-4"><a className="link" href={h.bookingUrl} target="_blank" rel="noopener noreferrer">Official site ↗</a></td>)}</tr>
          </tbody>
        </table>
      </div>
      {/* mobile cards */}
      <div className="mt-6 space-y-4 md:hidden">
        {hs.map((h) => (
          <article key={h.id} className="border border-charcoal/15 bg-paper p-4">
            <h4 className="display text-2xl">{h.name}</h4>
            <dl className="mt-3 space-y-3 text-sm">
              {rows.map((r) => <div key={r.label}><dt className="label !text-[.6rem]">{r.label}</dt><dd>{r.get(h)}</dd></div>)}
            </dl>
            <a className="btn mt-4 w-full" href={h.bookingUrl} target="_blank" rel="noopener noreferrer">Official site ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}
