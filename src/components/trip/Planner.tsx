import { useMemo, useState } from 'react';
import type { ConciergeData, TripState } from './types';
import { gDir, aDir } from './format';
import { useI18n, rich, NewTab, type TripT } from './i18n';

type Props = {
  data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void; reset: () => void; saved: boolean; goStay: () => void;
  step: number; done: boolean; setStep: (n: number) => void; setDone: (b: boolean) => void;
};

const TOGETHER = ['car', 'stay', 'airport', 'family'] as const;
type StepId = keyof TripT['steps'];

function Choice({ checked, onChange, title, sub, type = 'radio', name }: { checked: boolean; onChange: () => void; title: string; sub?: string; type?: 'radio' | 'checkbox'; name: string }) {
  return (
    <label className={`flex min-h-[3.5rem] cursor-pointer items-start gap-4 border-[1.5px] p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-clay ${checked ? 'border-charcoal bg-champagne/50' : 'border-line bg-paper hover:border-charcoal'}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="check mt-0.5" />
      <span><span className="block">{title}</span>{sub && <span className="block text-taupe">{sub}</span>}</span>
    </label>
  );
}

const withParams = (href: string, p: Record<string, string>) => { const u = new URL(href); Object.entries(p).forEach(([k, v]) => u.searchParams.set(k, v)); return u.href; };

export default function Planner({ data, trip, update, reset, saved, goStay, step, done, setStep, setDone }: Props) {
  const { t, fmt, dur, mi, tiny, day, nights: nightsBetween } = useI18n();
  const steps: StepId[] = trip.mode === 'fly' ? ['arrival', 'airport', 'travelers', 'stay', 'around', 'together'] : ['arrival', 'travelers', 'stay', 'around', 'together'];
  const i = Math.min(step, steps.length - 1);
  const [copied, setCopied] = useState(false);
  const name = steps[i];
  const nights = nightsBetween(trip.checkin, trip.checkout);
  const hotel = data.hotels.find((h) => h.id === trip.hotelId) ?? null;
  const airport = trip.mode === 'fly' ? data.airports.find((a) => a.code === trip.airport) ?? null : null;
  const datesOk = nights > 0 && nights <= 14;

  const itinerary = useMemo(() => buildItinerary(data, trip, hotel, airport, { t, fmt, dur, mi, tiny, day, nightsBetween }), [data, trip, hotel, airport, t.it]);
  const text = itineraryText(data, itinerary, t, fmt);

  const next = () => (i < steps.length - 1 ? setStep(i + 1) : setDone(true));
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ } };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: t.fileName });
    document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  if (done) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button type="button" className="link tap" onClick={() => { setDone(false); setStep(0); }}>{t.change}</button>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn" onClick={copy}>{copied ? t.copied : t.copy}</button>
            <button type="button" className="btn" onClick={download}>{t.download}</button>
            <button type="button" className="btn" onClick={() => window.print()}>{t.print}</button>
          </div>
        </div>
        <article className="mt-8 border border-charcoal/20 bg-paper p-6 md:p-12" aria-labelledby="ww">
          <p className="text-taupe">{data.couple} · {data.dateLong}</p>
          <h3 id="ww" className="h2 mt-3">{t.planTitle}</h3>
          <p className="mt-3 text-taupe">{t.planNote}</p>
          <ol className="mt-10 space-y-0">
            {itinerary.map((s, k) => (
              <li key={k} className="grid gap-x-8 gap-y-2 border-t border-charcoal/15 py-7 md:grid-cols-[11rem_1fr]">
                <div><p className="label text-taupe">{s.when}</p><p className="heading mt-1 text-2xl">{s.title}</p></div>
                <div>
                  {s.lines.map((l, j) => <p key={j} className="mb-2 max-w-xl">{l}</p>)}
                  {s.links && <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 print:hidden">{s.links.map((l) => <a key={l.href} className="link tap" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗<NewTab /></a>)}</p>}
                </div>
              </li>
            ))}
          </ol>
        </article>
        {trip.together.length > 0 && <TogetherNote data={data} />}
        <p className="mt-6 text-taupe print:hidden">
          {fmt(t.storedNote, { saved: saved ? t.savedWord : '' })}{' '}
          <button className="link tap" type="button" onClick={reset}>{t.clearPlan}</button>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-semibold text-taupe" aria-live="polite">{fmt(t.stepOf, { i: i + 1, n: steps.length, name: t.steps[name] })}</p>
      <div className="mt-3 h-1 bg-charcoal/15" aria-hidden><div className="h-1 bg-charcoal transition-all duration-500" style={{ width: `${((i + 1) / steps.length) * 100}%` }} /></div>

      <fieldset className="mt-10 min-w-0">
        {name === 'arrival' && (<>
          <legend className="h3">{t.qArrival}</legend>
          <div className="mt-6 grid gap-3">
            <Choice name="mode" checked={trip.mode === 'fly'} onChange={() => update({ mode: 'fly' })} title={t.fly} />
            <Choice name="mode" checked={trip.mode === 'drive'} onChange={() => update({ mode: 'drive' })} title={t.drive} sub={t.driveSub} />
          </div>
          <label className="mt-8 block"><span className="label">{t.from} <span className="font-normal text-taupe">{t.optional}</span></span>
            <input className="field" value={trip.from} onChange={(e) => update({ from: e.target.value })} placeholder={t.fromPh} autoComplete="off" maxLength={120} />
          </label>
          <p className="mt-2 text-sm text-taupe">{t.fromNote}</p>
        </>)}

        {name === 'airport' && (<>
          <legend className="h3">{t.qAirport}</legend>
          <div className="mt-6 grid gap-3">
            {data.airports.map((a) => (
              <Choice key={a.code} name="airport" checked={trip.airport === a.code} onChange={() => update({ airport: a.code })} title={`${a.name} (${a.code})`} sub={fmt(t.airportSub, { note: a.note, mi: mi(a.toVenue.miles), t: dur(a.toVenue.minutes) })} />
            ))}
          </div>
        </>)}

        {name === 'travelers' && (<>
          <legend className="h3">{t.qTravelers}</legend>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <span className="label" id="party-l">{t.numTravelers}</span>
              <div className="mt-2 flex items-center gap-4" role="group" aria-labelledby="party-l">
                <button type="button" className="btn !min-h-12 !w-12 !px-0 text-2xl" aria-label={t.fewer} onClick={() => update({ party: Math.max(1, trip.party - 1) })}>−</button>
                <output className="heading w-12 text-center text-3xl" aria-live="polite">{trip.party}</output>
                <button type="button" className="btn !min-h-12 !w-12 !px-0 text-2xl" aria-label={t.more} onClick={() => update({ party: Math.min(20, trip.party + 1) })}>+</button>
              </div>
            </div>
            <label><span className="label">{t.arrive}</span><input type="date" className="field" value={trip.checkin} max={trip.checkout} onChange={(e) => update({ checkin: e.target.value })} /></label>
            <label><span className="label">{t.depart}</span><input type="date" className="field" value={trip.checkout} min={trip.checkin} onChange={(e) => update({ checkout: e.target.value })} /></label>
          </div>
          <p className={`mt-4 ${datesOk ? 'text-taupe' : 'font-semibold text-error'}`} role="status">
            {datesOk ? fmt(nights === 1 ? t.nightsOne : t.nightsMany, { n: nights, date: day(data.dateISO) }) : t.datesBad}
          </p>
        </>)}

        {name === 'stay' && (<>
          <legend className="h3">{t.qStay}</legend>
          <div className="mt-6 grid gap-3">
            <Choice name="stay" checked={trip.stayType === 'hotel'} onChange={() => update({ stayType: 'hotel' })} title={t.stayHotel} />
            <Choice name="stay" checked={trip.stayType === 'rental'} onChange={() => update({ stayType: 'rental' })} title={t.stayRental} />
            <Choice name="stay" checked={trip.stayType === 'both'} onChange={() => update({ stayType: 'both' })} title={t.stayBoth} />
          </div>
          {trip.stayType !== 'rental' && (
            <div className="mt-8">
              <p className="label">{t.pickHotel} <span className="font-normal text-taupe">{t.pickHotelHint}</span></p>
              <div className="mt-3 grid gap-3">
                {data.hotels.map((h) => <Choice key={h.id} name="hotel" checked={trip.hotelId === h.id} onChange={() => update({ hotelId: h.id })} title={h.name} sub={fmt(t.hotelSub, { tier: h.tier, mi: mi(h.toVenue.miles), t: dur(h.toVenue.minutes) })} />)}
              </div>
              <button type="button" className="link tap mt-4" onClick={goStay}>{t.exploreMap}</button>
            </div>
          )}
        </>)}

        {name === 'around' && (<>
          <legend className="h3">{t.qAround}</legend>
          <div className="mt-6 grid gap-3">
            <Choice name="tr" checked={trip.transport === 'rental'} onChange={() => update({ transport: 'rental' })} title={t.rentalCar} sub={trip.mode === 'drive' ? t.rentalSubDrive : t.rentalSubFly} />
            <Choice name="tr" checked={trip.transport === 'rideshare'} onChange={() => update({ transport: 'rideshare' })} title={t.rideshare} sub={t.rideSub} />
            <Choice name="tr" checked={trip.transport === 'coordinate'} onChange={() => update({ transport: 'coordinate' })} title={t.coordinate} />
          </div>
        </>)}

        {name === 'together' && (<>
          <legend className="h3">{t.qTogether}</legend>
          <p className="mt-3 text-taupe">{t.togetherIntro}</p>
          <div className="mt-6 grid gap-3">
            {TOGETHER.map((k) => (
              <Choice key={k} type="checkbox" name="tg" checked={trip.together.includes(k)} onChange={() => update({ together: trip.together.includes(k) ? trip.together.filter((x) => x !== k) : [...trip.together, k] })} title={t.togetherOpts[k]} />
            ))}
          </div>
        </>)}
      </fieldset>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button type="button" className="btn" onClick={() => setStep(Math.max(0, i - 1))} disabled={i === 0}>{t.back}</button>
        <button type="button" className="btn btn-solid" onClick={next} disabled={name === 'travelers' && !datesOk}>{i === steps.length - 1 ? t.preview : t.continue}</button>
      </div>
      <p className="mt-6 text-center text-sm text-taupe">{t.savedAsYouGo}</p>
    </div>
  );
}

function TogetherNote({ data }: { data: ConciergeData }) {
  const { t } = useI18n();
  const nav = data.t.steps.together;
  return (
    <aside className="mt-8 border border-charcoal/20 p-6 print:hidden">
      <p className="heading text-xl">{nav}</p>
      <p className="mt-3 max-w-xl">
        {data.group.state === 'public' && data.group.url ? <>{t.groupPublic} <a className="link" href={data.group.url} target="_blank" rel="noopener noreferrer">{t.groupJoin} ↗<NewTab /></a></>
          : data.group.state === 'gated' ? rich(t.groupGated, { link: <a className="link" href={data.rsvpHref}>{data.rsvpVerb}</a> })
          : t.groupSoon}
      </p>
    </aside>
  );
}

type Stop = { when: string; title: string; lines: string[]; links?: { label: string; href: string }[] };
type Tools = { t: TripT; fmt: (s: string, v?: Record<string, string | number>) => string; dur: (m: number) => string; mi: (n: number) => string; tiny: (i: string) => string; day: (i: string) => string; nightsBetween: (a: string, b: string) => number };

function buildItinerary(data: ConciergeData, tr: TripState, hotel: ConciergeData['hotels'][number] | null, ap: ConciergeData['airports'][number] | null, k: Tools): Stop[] {
  const { fmt, dur, mi, tiny, day, nightsBetween } = k;
  const it = k.t.it;
  const out: Stop[] = [];
  const v = data.venue;
  const wantsHotel = tr.stayType !== 'rental';
  const dest = wantsHotel && hotel ? hotel : null;
  const rental = tr.transport === 'rental' && tr.mode === 'fly';

  // arrival
  const arrivalLines: string[] = [];
  const links: { label: string; href: string }[] = [];
  if (ap) {
    arrivalLines.push(fmt(it.flyInto, { name: ap.name, code: ap.code, note: ap.note }));
    if (rental) {
      arrivalLines.push(ap.code === 'SAN' ? it.rentalSan : fmt(it.rentalOther, { code: ap.code }));
      links.push(...data.rentalCompanies.slice(0, 5).map((c) => ({ label: c.name, href: c.href })));
    } else if (tr.transport === 'rideshare') arrivalLines.push(it.rideAirport);
    else arrivalLines.push(it.coordAirport);
    if (dest) {
      const leg = dest.fromAirport[ap.code];
      if (leg) arrivalLines.push(fmt(it.airportToHotel, { hotel: dest.name, mi: mi(leg.miles), t: dur(leg.minutes) }));
      links.push({ label: it.linkAirportHotel, href: gDir(ap.name, `${dest.name}, ${dest.address}`) }, { label: it.linkApple, href: aDir(ap.name, dest.address) });
    } else {
      arrivalLines.push(fmt(it.airportToVenue, { venue: v.name, mi: mi(ap.toVenue.miles), t: dur(ap.toVenue.minutes) }));
    }
  } else {
    arrivalLines.push(tr.from ? fmt(it.drivingFrom, { from: tr.from }) : it.drivingIn);
    const to = dest ? `${dest.name}, ${dest.address}` : `${v.name}, ${v.address}`;
    if (tr.from) links.push({ label: fmt(dest ? it.linkFromHotel : it.linkFromVenue, { from: tr.from }), href: gDir(tr.from, to) }, { label: it.linkApple, href: aDir(tr.from, dest ? dest.address : v.address) });
    else arrivalLines.push(it.addFrom);
  }
  out.push({ when: tiny(tr.checkin), title: it.arrive, lines: arrivalLines, links });

  // accommodation
  const stayLinks: { label: string; href: string }[] = [];
  const n = nightsBetween(tr.checkin, tr.checkout);
  const stayLines: string[] = [fmt(it.stayLine, {
    travelers: fmt(tr.party === 1 ? it.travelerOne : it.travelerMany, { n: tr.party }), a: tiny(tr.checkin), b: tiny(tr.checkout),
    nights: fmt(n === 1 ? it.nightOne : it.nightMany, { n }),
  })];
  if (dest) {
    stayLines.push(fmt(it.hotelLine, { hotel: dest.name, address: dest.address, type: dest.type }));
    stayLinks.push({ label: it.linkBook, href: dest.bookingUrl });
    stayLines.push(it.chooseDates);
  } else if (wantsHotel) stayLines.push(fmt(it.noHotel, { tab: data.stayTab }));
  if (tr.stayType !== 'hotel') {
    stayLines.push(it.rentalsIntro);
    data.rentals.forEach((r) => {
      stayLinks.push({ label: `Airbnb · ${r.area}`, href: withParams(r.airbnb, { checkin: tr.checkin, checkout: tr.checkout, adults: String(tr.party) }) });
      stayLinks.push({ label: `Vrbo · ${r.area}`, href: withParams(r.vrbo, { startDate: tr.checkin, endDate: tr.checkout, adults: String(tr.party) }) });
    });
  }
  out.push({ when: it.stayWhen, title: tr.stayType === 'rental' ? it.stayRentalTitle : tr.stayType === 'both' ? it.stayBothTitle : it.stayHotelTitle, lines: stayLines, links: stayLinks });

  // wedding day
  const wl: string[] = [fmt(it.venueLine, { venue: v.name, address: v.address })];
  if (dest) wl.push(fmt(it.fromHotel, { hotel: dest.name, mi: mi(dest.toVenue.miles), t: dur(dest.toVenue.minutes) }));
  if (data.schedule.length) data.schedule.forEach((s) => wl.push(`${s.time} · ${s.title}${s.note ? ` (${s.note})` : ''}`));
  else wl.push(it.schedTbc);
  if (tr.transport !== 'rental' && tr.mode === 'fly') wl.push(it.rideHome);
  out.push({
    when: day(data.dateISO), title: it.weddingTitle, lines: wl,
    links: [
      { label: dest ? it.linkHotelVenue : it.linkDirections, href: dest ? dest.googleDirections : v.googleDirections },
      { label: it.linkApple, href: dest ? dest.appleDirections : v.appleDirections },
    ],
  });

  // departure
  const dl: string[] = [];
  const dlinks: { label: string; href: string }[] = [];
  if (ap) {
    const driveMin = dest?.fromAirport[ap.code]?.minutes ?? ap.toVenue.minutes;
    const total = Math.ceil((driveMin + 120 + (rental ? 30 : 0)) / 15) * 15;
    dl.push(fmt(it.toAirport, { from: dest ? dest.name : v.name, code: ap.code, t: dur(driveMin) }));
    dl.push(fmt(it.ruleOfThumb, { t: dur(total), rentalPart: rental ? it.rentalPart : '' }));
    dlinks.push({ label: it.linkToAirport, href: gDir(dest ? `${dest.name}, ${dest.address}` : `${v.name}, ${v.address}`, ap.name) });
  } else {
    dl.push(tr.from ? fmt(it.headHomeTo, { from: tr.from }) : it.safeTravels);
    if (tr.from) dlinks.push({ label: it.linkHome, href: gDir(dest ? `${dest.name}, ${dest.address}` : v.address, tr.from) });
  }
  out.push({ when: tiny(tr.checkout), title: it.headHome, lines: dl, links: dlinks });
  return out;
}

function itineraryText(data: ConciergeData, it: Stop[], t: TripT, fmt: Tools['fmt']): string {
  const rows = [fmt(t.it.txtTitle, { couple: data.couple, date: data.dateLong }), `${data.venue.name}, ${data.venue.address}`, t.it.txtNote, ''];
  it.forEach((s) => {
    rows.push(`${s.when.toUpperCase()} — ${s.title}`, ...s.lines.map((l) => `  ${l}`));
    s.links?.forEach((l) => rows.push(`  ${l.label}: ${l.href}`));
    rows.push('');
  });
  return rows.join('\n');
}
