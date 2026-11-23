import { useState } from 'react';
import MapView from './MapView';
import type { ConciergeData, HotelData, TripState } from './types';
import { useI18n, NewTab } from './i18n';

type Props = { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void; goPlan: () => void };

function Photo({ h }: { h: HotelData }) {
  const { t } = useI18n();
  if (h.photo) return <img src={h.photo} alt="" className="h-full w-full object-cover" loading="lazy" />;
  return (
    <div className="grid h-full w-full place-items-center bg-champagne/70 text-center">
      <div>
        <p className="font-display text-3xl italic text-charcoal/80">{h.area}</p>
        <p className="mt-2 text-sm text-taupe">{t.photoNote}</p>
      </div>
    </div>
  );
}

export default function HotelExplorer({ data, trip, update, goPlan }: Props) {
  const { t, fmt, dur, mi, tiny } = useI18n();
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

  return (
    <div>
      {/* airport chooser */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="label">{t.distancesFrom}</span>
        <div role="group" aria-label={t.chooseAirport} className="flex flex-wrap gap-2">
          {data.airports.map((a) => (
            <button key={a.code} type="button" aria-pressed={trip.airport === a.code} onClick={() => update({ airport: a.code })} title={a.name}
              className="min-h-11 min-w-14 border-[1.5px] border-line px-4 font-semibold transition-colors aria-pressed:border-charcoal aria-pressed:bg-charcoal aria-pressed:text-ivory">{a.code}</button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-3 text-taupe">
          <input type="checkbox" checked={airRoute} onChange={(e) => setAirRoute(e.target.checked)} className="check" />
          {fmt(t.showRoute, { code: airport.code })}
        </label>
      </div>

      {/* mobile toggle */}
      <div role="tablist" aria-label={t.mapOrList} className="mb-4 grid grid-cols-2 border-[1.5px] border-line lg:hidden">
        {(['map', 'list'] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className="min-h-12 font-semibold aria-selected:bg-charcoal aria-selected:text-ivory">{v === 'map' ? t.map : t.list}</button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        {/* LIST */}
        <ol aria-label={t.hotelsLabel} className={`${view === 'list' ? 'block' : 'hidden'} space-y-3 lg:order-1 lg:block`}>
          {data.hotels.map((h, i) => {
            const isSel = h.id === trip.hotelId;
            const r = h.toVenue;
            const fa = h.fromAirport[airport.code];
            const inCompare = trip.compare.includes(h.id);
            return (
              <li key={h.id} id={`hotel-${h.id}`} className={`border bg-paper transition-colors ${isSel ? 'border-charcoal' : 'border-charcoal/25'}`}>
                <button type="button" onClick={() => select(h.id)} aria-expanded={isSel} className="flex w-full items-start gap-4 p-4 text-left md:p-5">
                  <span aria-hidden className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full font-semibold ${isSel ? 'bg-clay text-ivory' : 'bg-charcoal text-ivory'}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-taupe">{h.tier} · {h.area}</span>
                    <span className="heading mt-1 block text-[1.3rem]">{h.name}</span>
                    <span className="mt-2 block text-taupe">{fmt(t.toVenueLine, { mi: mi(r.miles), t: dur(r.minutes), venue: data.venue.name })}</span>
                  </span>
                  <span aria-hidden className={`mt-1 text-2xl transition-transform ${isSel ? 'rotate-45' : ''}`}>+</span>
                </button>

                {isSel && (
                  <div className="border-t border-charcoal/15 p-4 md:p-5">
                    <div className="aspect-[16/8] overflow-hidden"><Photo h={h} /></div>
                    <p className="mt-4">{h.why}</p>
                    <dl className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div><dt className="label">{fmt(t.toVenue, { venue: data.venue.name })}</dt><dd className="mt-1 text-xl font-semibold">{mi(r.miles)}<span className="font-normal text-taupe"> · {dur(r.minutes)}</span></dd><dd className="text-sm text-taupe">{t.approx}</dd></div>
                      <div><dt className="label">{fmt(t.fromAirport, { code: airport.code })}</dt><dd className="mt-1 text-xl font-semibold">{fa ? mi(fa.miles) : '—'}<span className="font-normal text-taupe">{fa ? ` · ${dur(fa.minutes)}` : ''}</span></dd><dd className="text-sm text-taupe">{t.approx}</dd></div>
                    </dl>
                    <p className="mt-4"><span className="label">{t.address}</span>{h.address}</p>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.amenities}>
                      {h.amenities.map((a) => <li key={a} className="border border-charcoal/25 px-3 py-1 text-sm">{a}</li>)}
                    </ul>
                    <p className="mt-2 text-sm text-taupe">{t.amenitiesNote}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <a className="btn btn-solid" href={h.bookingUrl} target="_blank" rel="noopener noreferrer">{t.bookOnSite} ↗<NewTab /></a>
                      <a className="btn" href={h.googleDirections} target="_blank" rel="noopener noreferrer">{t.dirGoogle} ↗<NewTab /></a>
                      <a className="btn" href={h.appleDirections} target="_blank" rel="noopener noreferrer">{t.dirApple} ↗<NewTab /></a>
                      <button type="button" className="btn" aria-pressed={inCompare} onClick={() => toggleCompare(h.id)} disabled={!inCompare && trip.compare.length >= 3}>{inCompare ? t.inCompare : t.addCompare}</button>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-taupe">
                      {t.bookingNote}{' '}{fmt(t.datesNote, { from: tiny(trip.checkin), to: tiny(trip.checkout) })}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* MAP */}
        <div className={`${view === 'map' ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:order-2 lg:block`}>
          <div className="h-[60svh] min-h-[22rem] border border-charcoal/20 lg:h-[34rem]">
            <MapView data={data} selectedId={trip.hotelId} airport={trip.airport} showAirportRoute={airRoute} onSelect={select} />
          </div>
          <p className="mt-3 text-sm text-taupe">
            {fmt(t.mapNote, { source: data.routeMeta.source, date: data.routeMeta.date, routeNote: data.routeMeta.note })}
          </p>
          {selected && view === 'map' && (
            <div className="mt-4 border border-charcoal bg-paper p-4 lg:hidden" aria-live="polite">
              <p className="text-taupe">{selected.tier}</p>
              <p className="heading mt-1 text-xl">{selected.name}</p>
              <p className="mt-1 text-taupe">{fmt(t.toVenueLine, { mi: mi(selected.toVenue.miles), t: dur(selected.toVenue.minutes), venue: data.venue.name })}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a className="btn btn-solid !px-3" href={selected.bookingUrl} target="_blank" rel="noopener noreferrer">{t.bookHotel} ↗<NewTab /></a>
                <a className="btn !px-3" href={selected.googleDirections} target="_blank" rel="noopener noreferrer">{t.directions} ↗<NewTab /></a>
              </div>
              <button type="button" className="link tap mt-3" onClick={() => setView('list')}>{t.seeDetails}</button>
            </div>
          )}
        </div>
      </div>

      {trip.compare.length >= 2 && <Compare data={data} trip={trip} update={update} />}
      {selected && (
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-solid" onClick={goPlan}>{fmt(t.useInPlan, { hotel: selected.name.split(' ')[0] })}</button>
        </div>
      )}
    </div>
  );
}

function Compare({ data, trip, update }: { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void }) {
  const { t, fmt, dur, mi } = useI18n();
  const hs = trip.compare.map((id) => data.hotels.find((h) => h.id === id)!).filter(Boolean);
  const ap = trip.airport;
  const rows: { label: string; get: (h: HotelData) => string }[] = [
    { label: t.rowDistance, get: (h) => mi(h.toVenue.miles) },
    { label: t.rowDrive, get: (h) => fmt(t.rowDriveVal, { t: dur(h.toVenue.minutes) }) },
    { label: fmt(t.rowFrom, { code: ap }), get: (h) => (h.fromAirport[ap] ? `${mi(h.fromAirport[ap].miles)} · ${dur(h.fromAirport[ap].minutes)}` : '—') },
    { label: t.rowFamily, get: (h) => h.family },
    { label: t.rowRooms, get: (h) => h.roomTypes },
    { label: t.rowKitchen, get: (h) => h.kitchen },
    { label: t.rowParking, get: (h) => h.parking },
  ];
  return (
    <section aria-labelledby="cmp" className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <h3 id="cmp" className="display text-4xl">{t.sideBySide}</h3>
        <button type="button" className="link tap" onClick={() => update({ compare: [] })}>{t.clear}</button>
      </div>
      <p className="mt-2 text-taupe">{t.cmpNote}</p>
      {/* desktop table */}
      <div className="mt-6 hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{t.cmpCaption}</caption>
          <thead><tr><td />{hs.map((h) => <th key={h.id} scope="col" className="heading border-b border-charcoal/25 pb-3 pr-4 align-bottom text-lg">{h.name}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-charcoal/15 align-top">
                <th scope="row" className="label w-44 py-4 pr-4">{r.label}</th>
                {hs.map((h) => <td key={h.id} className="py-4 pr-4">{r.get(h)}</td>)}
              </tr>
            ))}
            <tr><th scope="row" className="label py-4">{t.rowBooking}</th>{hs.map((h) => <td key={h.id} className="py-4 pr-4"><a className="link" href={h.bookingUrl} target="_blank" rel="noopener noreferrer">{t.officialSite} ↗<NewTab /></a></td>)}</tr>
          </tbody>
        </table>
      </div>
      {/* mobile cards */}
      <div className="mt-6 space-y-4 md:hidden">
        {hs.map((h) => (
          <article key={h.id} className="border border-charcoal/25 bg-paper p-4">
            <h4 className="heading text-xl">{h.name}</h4>
            <dl className="mt-3 space-y-3">
              {rows.map((r) => <div key={r.label}><dt className="label">{r.label}</dt><dd>{r.get(h)}</dd></div>)}
            </dl>
            <a className="btn mt-4 w-full" href={h.bookingUrl} target="_blank" rel="noopener noreferrer">{t.officialSite} ↗<NewTab /></a>
          </article>
        ))}
      </div>
    </section>
  );
}
