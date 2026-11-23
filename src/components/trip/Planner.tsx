import { useMemo, useState } from 'react';
import type { ConciergeData, TripState } from './types';
import { dur, mi, fmtDate, nightsBetween, gDir, aDir } from './format';

type Props = { data: ConciergeData; trip: TripState; update: (p: Partial<TripState>) => void; reset: () => void; saved: boolean; goStay: () => void };

const TOGETHER = [
  ['car', 'Sharing a rental car'],
  ['stay', 'Sharing an Airbnb or rental house'],
  ['airport', 'Coordinating airport transportation'],
  ['family', 'Traveling with relatives or friends'],
] as const;

function Choice({ checked, onChange, title, sub, type = 'radio', name }: { checked: boolean; onChange: () => void; title: string; sub?: string; type?: 'radio' | 'checkbox'; name: string }) {
  return (
    <label className={`flex min-h-[3.5rem] cursor-pointer items-start gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-clay ${checked ? 'border-charcoal bg-paper' : 'border-charcoal/20 hover:border-charcoal/50'}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="mt-1.5 h-4 w-4 accent-[#2b2724]" />
      <span><span className="block">{title}</span>{sub && <span className="block text-sm text-taupe">{sub}</span>}</span>
    </label>
  );
}

const withParams = (href: string, p: Record<string, string>) => { const u = new URL(href); Object.entries(p).forEach(([k, v]) => u.searchParams.set(k, v)); return u.href; };

export default function Planner({ data, trip, update, reset, saved, goStay }: Props) {
  const steps = trip.mode === 'fly' ? ['Arrival', 'Airport', 'Travelers', 'Stay', 'Getting around', 'Travel together'] : ['Arrival', 'Travelers', 'Stay', 'Getting around', 'Travel together'];
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const name = steps[i];
  const nights = nightsBetween(trip.checkin, trip.checkout);
  const hotel = data.hotels.find((h) => h.id === trip.hotelId) ?? null;
  const airport = trip.mode === 'fly' ? data.airports.find((a) => a.code === trip.airport) ?? null : null;
  const datesOk = nights > 0 && nights <= 14;

  const itinerary = useMemo(() => buildItinerary(data, trip, hotel, airport), [data, trip, hotel, airport]);
  const text = itineraryText(data, itinerary);

  const next = () => (i < steps.length - 1 ? setI(i + 1) : setDone(true));
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ } };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'wedding-weekend-plan.txt' });
    document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  if (done) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button type="button" className="link text-sm" onClick={() => { setDone(false); setI(0); }}>← Change my answers</button>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn !min-h-[2.75rem]" onClick={copy}>{copied ? 'Copied ✓' : 'Copy summary'}</button>
            <button type="button" className="btn !min-h-[2.75rem]" onClick={download}>Download .txt</button>
            <button type="button" className="btn !min-h-[2.75rem]" onClick={() => window.print()}>Print</button>
          </div>
        </div>
        <article className="mt-8 border border-charcoal/15 bg-paper p-6 md:p-12" aria-labelledby="ww">
          <p className="eyebrow">{data.couple} · {data.dateLong}</p>
          <h3 id="ww" className="display mt-3 text-[clamp(2.4rem,6vw,4rem)]">Your Wedding Weekend</h3>
          <p className="mt-3 text-sm text-taupe">Travel times are road estimates under typical conditions, not live traffic. Open the Maps links for the current time.</p>
          <ol className="mt-10 space-y-0">
            {itinerary.map((s, k) => (
              <li key={k} className="grid gap-x-8 gap-y-2 border-t border-charcoal/12 py-7 md:grid-cols-[11rem_1fr]">
                <div><p className="label">{s.when}</p><p className="display mt-1 text-2xl">{s.title}</p></div>
                <div>
                  {s.lines.map((l, j) => <p key={j} className="mb-2 max-w-xl">{l}</p>)}
                  {s.links && <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm print:hidden">{s.links.map((l) => <a key={l.href} className="link tap" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>)}</p>}
                </div>
              </li>
            ))}
          </ol>
        </article>
        {trip.together.length > 0 && <TogetherNote data={data} />}
        <p className="mt-6 text-xs text-taupe print:hidden">
          Your answers are stored in this browser only{saved ? ' (saved)' : ''}. They are not sent to anyone and do not sync between devices. Use Copy or Download to keep a copy.{' '}
          <button className="link" type="button" onClick={reset}>Clear my saved plan</button>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow" aria-live="polite">Step {i + 1} of {steps.length} · {name}</p>
      <div className="mt-3 h-px bg-charcoal/15" aria-hidden><div className="h-px bg-charcoal transition-all duration-500" style={{ width: `${((i + 1) / steps.length) * 100}%` }} /></div>

      <fieldset className="mt-10 min-w-0">
        {name === 'Arrival' && (<>
          <legend className="display text-4xl">How will you be getting here?</legend>
          <div className="mt-6 grid gap-3">
            <Choice name="mode" checked={trip.mode === 'fly'} onChange={() => update({ mode: 'fly' })} title="Flying in" />
            <Choice name="mode" checked={trip.mode === 'drive'} onChange={() => update({ mode: 'drive' })} title="Driving" sub="Directions will start from where you tell us" />
          </div>
          <label className="mt-8 block"><span className="label">Where are you traveling from? <span className="normal-case tracking-normal">(optional)</span></span>
            <input className="field" value={trip.from} onChange={(e) => update({ from: e.target.value })} placeholder="City, state or full address" autoComplete="off" maxLength={120} />
          </label>
          <p className="mt-2 text-xs text-taupe">Used only to build directions links in your plan. It never leaves your browser.</p>
        </>)}

        {name === 'Airport' && (<>
          <legend className="display text-4xl">Which airport?</legend>
          <div className="mt-6 grid gap-3">
            {data.airports.map((a) => (
              <Choice key={a.code} name="airport" checked={trip.airport === a.code} onChange={() => update({ airport: a.code })} title={`${a.name} (${a.code})`} sub={`${a.note} · about ${mi(a.toVenue.miles)} / ${dur(a.toVenue.minutes)} to the venue`} />
            ))}
          </div>
        </>)}

        {name === 'Travelers' && (<>
          <legend className="display text-4xl">Who’s coming, and when?</legend>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <span className="label" id="party-l">Number of travelers</span>
              <div className="mt-2 flex items-center gap-4" role="group" aria-labelledby="party-l">
                <button type="button" className="btn !min-h-12 !w-12 !px-0" aria-label="Fewer travelers" onClick={() => update({ party: Math.max(1, trip.party - 1) })}>−</button>
                <output className="display w-10 text-center text-4xl" aria-live="polite">{trip.party}</output>
                <button type="button" className="btn !min-h-12 !w-12 !px-0" aria-label="More travelers" onClick={() => update({ party: Math.min(20, trip.party + 1) })}>+</button>
              </div>
            </div>
            <label><span className="label">Arrive</span><input type="date" className="field" value={trip.checkin} max={trip.checkout} onChange={(e) => update({ checkin: e.target.value })} /></label>
            <label><span className="label">Depart</span><input type="date" className="field" value={trip.checkout} min={trip.checkin} onChange={(e) => update({ checkout: e.target.value })} /></label>
          </div>
          <p className={`mt-4 text-sm ${datesOk ? 'text-taupe' : 'text-[#9b3d2e]'}`} role="status">
            {datesOk ? `${nights} night${nights === 1 ? '' : 's'}. The wedding is ${fmtDate(data.dateISO)}.` : 'Please choose a departure date after your arrival (up to 14 nights).'}
          </p>
        </>)}

        {name === 'Stay' && (<>
          <legend className="display text-4xl">Where would you like to stay?</legend>
          <div className="mt-6 grid gap-3">
            <Choice name="stay" checked={trip.stayType === 'hotel'} onChange={() => update({ stayType: 'hotel' })} title="Hotel or resort" />
            <Choice name="stay" checked={trip.stayType === 'rental'} onChange={() => update({ stayType: 'rental' })} title="Airbnb or vacation rental" />
            <Choice name="stay" checked={trip.stayType === 'both'} onChange={() => update({ stayType: 'both' })} title="Show me both" />
          </div>
          {trip.stayType !== 'rental' && (
            <div className="mt-8">
              <p className="label">Pick a hotel <span className="normal-case tracking-normal">(or compare them on the map)</span></p>
              <div className="mt-3 grid gap-3">
                {data.hotels.map((h) => <Choice key={h.id} name="hotel" checked={trip.hotelId === h.id} onChange={() => update({ hotelId: h.id })} title={h.name} sub={`${h.tier} · ${mi(h.toVenue.miles)}, about ${dur(h.toVenue.minutes)} to the venue`} />)}
              </div>
              <button type="button" className="link mt-4 text-sm" onClick={goStay}>Explore hotels on the map instead →</button>
            </div>
          )}
        </>)}

        {name === 'Getting around' && (<>
          <legend className="display text-4xl">How will you get around?</legend>
          <div className="mt-6 grid gap-3">
            <Choice name="tr" checked={trip.transport === 'rental'} onChange={() => update({ transport: 'rental' })} title="Rental car" sub={trip.mode === 'drive' ? 'Not needed if you are driving your own car' : 'The most dependable way to reach and leave the venue'} />
            <Choice name="tr" checked={trip.transport === 'rideshare'} onChange={() => update({ transport: 'rideshare' })} title="Uber / Lyft" sub="Availability at the venue late at night can’t be promised" />
            <Choice name="tr" checked={trip.transport === 'coordinate'} onChange={() => update({ transport: 'coordinate' })} title="Coordinate a ride with other guests" />
          </div>
        </>)}

        {name === 'Travel together' && (<>
          <legend className="display text-4xl">Interested in traveling together?</legend>
          <p className="mt-3 text-taupe">Optional. Tick anything that sounds useful and we’ll point you to the right place. Nothing is shared with anyone from this step.</p>
          <div className="mt-6 grid gap-3">
            {TOGETHER.map(([k, label]) => (
              <Choice key={k} type="checkbox" name="tg" checked={trip.together.includes(k)} onChange={() => update({ together: trip.together.includes(k) ? trip.together.filter((x) => x !== k) : [...trip.together, k] })} title={label} />
            ))}
          </div>
        </>)}
      </fieldset>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button type="button" className="btn" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
        <button type="button" className="btn btn-solid" onClick={next} disabled={name === 'Travelers' && !datesOk}>{i === steps.length - 1 ? 'Preview my plan' : 'Continue'}</button>
      </div>
      <p className="mt-6 text-center text-xs text-taupe">Saved as you go, in this browser only.</p>
    </div>
  );
}

function TogetherNote({ data }: { data: ConciergeData }) {
  return (
    <aside className="mt-8 border border-charcoal/15 p-6 print:hidden">
      <p className="eyebrow">Travel together</p>
      <p className="mt-3 max-w-xl">
        {data.group.state === 'public' && data.group.url ? <>Connect with other guests to coordinate stays, rides, and plans. <a className="link" href={data.group.url} target="_blank" rel="noopener noreferrer">Join the guest group ↗</a></>
          : data.group.state === 'gated' ? <>The private guest group link is shared after you <a className="link" href={`${data.base}/rsvp/`}>RSVP</a> as attending. Joining is always your choice, and nobody is added automatically.</>
          : <>A private guest group for sharing rides and stays is coming soon. We will add the link here when it is ready.</>}
      </p>
    </aside>
  );
}

type Stop = { when: string; title: string; lines: string[]; links?: { label: string; href: string }[] };

function buildItinerary(data: ConciergeData, t: TripState, hotel: ConciergeData['hotels'][number] | null, ap: ConciergeData['airports'][number] | null): Stop[] {
  const out: Stop[] = [];
  const v = data.venue;
  const wantsHotel = t.stayType !== 'rental';
  const dest = wantsHotel && hotel ? hotel : null;
  const rental = t.transport === 'rental' && t.mode === 'fly';

  // arrival
  const arrivalLines: string[] = [];
  const links: { label: string; href: string }[] = [];
  if (ap) {
    arrivalLines.push(`Fly into ${ap.name} (${ap.code}). ${ap.note}`);
    if (rental) {
      arrivalLines.push(ap.code === 'SAN' ? 'Pick up a rental car at the SAN Rental Car Center (3355 Admiral Boland Way). A free shuttle runs between the terminals and the center.' : `Check your airline and the ${ap.code} airport website for rental-car pickup.`);
      links.push(...data.rentalCompanies.slice(0, 5).map((c) => ({ label: c.name, href: c.href })));
    } else if (t.transport === 'rideshare') arrivalLines.push('Request an Uber or Lyft from the airport. Fares and wait times vary, and we have not verified any prices.');
    else arrivalLines.push('Coordinate a ride with other guests through the guest group once it is open.');
    if (dest) {
      const leg = dest.fromAirport[ap.code];
      if (leg) arrivalLines.push(`Airport to ${dest.name}: about ${mi(leg.miles)}, roughly ${dur(leg.minutes)} in typical conditions.`);
      links.push({ label: 'Airport → hotel (Google)', href: gDir(`${ap.name}`, `${dest.name}, ${dest.address}`) }, { label: 'Apple Maps', href: aDir(ap.name, dest.address) });
    } else {
      arrivalLines.push(`Airport to ${v.name}: about ${mi(ap.toVenue.miles)}, roughly ${dur(ap.toVenue.minutes)} in typical conditions.`);
    }
  } else {
    arrivalLines.push(t.from ? `Driving from ${t.from}.` : 'Driving in.');
    const to = dest ? `${dest.name}, ${dest.address}` : `${v.name}, ${v.address}`;
    if (t.from) links.push({ label: `${t.from} → ${dest ? 'hotel' : 'venue'} (Google)`, href: gDir(t.from, to) }, { label: 'Apple Maps', href: aDir(t.from, dest ? dest.address : v.address) });
    else arrivalLines.push('Add where you are traveling from in step 1 to get a directions link.');
  }
  out.push({ when: fmtDate(t.checkin), title: 'Arrive', lines: arrivalLines, links });

  // accommodation
  const stayLinks: { label: string; href: string }[] = [];
  const stayLines: string[] = [`${t.party} traveler${t.party === 1 ? '' : 's'}, ${fmtDate(t.checkin)} – ${fmtDate(t.checkout)} (${nightsBetween(t.checkin, t.checkout)} nights).`];
  if (dest) {
    stayLines.push(`${dest.name}, ${dest.address}. ${dest.type}.`);
    stayLinks.push({ label: 'Book on hotel site', href: dest.bookingUrl });
    stayLines.push('Choose your dates on the hotel’s own site. This website does not check availability or prices, and nothing is reserved until you book there.');
  } else if (wantsHotel) stayLines.push('You have not picked a hotel yet. Compare them on the map in the Hotels tab.');
  if (t.stayType !== 'hotel') {
    stayLines.push('Vacation-rental searches near the venue (set to your dates and group size):');
    data.rentals.forEach((r) => {
      stayLinks.push({ label: `Airbnb · ${r.area}`, href: withParams(r.airbnb, { checkin: t.checkin, checkout: t.checkout, adults: String(t.party) }) });
      stayLinks.push({ label: `Vrbo · ${r.area}`, href: withParams(r.vrbo, { startDate: t.checkin, endDate: t.checkout, adults: String(t.party) }) });
    });
  }
  out.push({ when: 'Where you’ll stay', title: t.stayType === 'rental' ? 'Vacation rental' : t.stayType === 'both' ? 'Hotel or rental' : 'Hotel', lines: stayLines, links: stayLinks });

  // wedding day
  const wl: string[] = [`${v.name}, ${v.address}.`];
  if (dest) wl.push(`From ${dest.name}: about ${mi(dest.toVenue.miles)}, roughly ${dur(dest.toVenue.minutes)} in typical conditions. Allow extra time for weekend traffic and parking.`);
  if (data.schedule.length) data.schedule.forEach((s) => wl.push(`${s.time} · ${s.title}${s.note ? ` (${s.note})` : ''}`));
  else wl.push('Ceremony and reception times will be added here once confirmed.');
  if (t.transport !== 'rental' && t.mode === 'fly') wl.push('Plan your ride home before the evening begins. We can’t promise rideshare availability at the venue late at night.');
  out.push({
    when: fmtDate(data.dateISO, { weekday: 'long', month: 'long', day: 'numeric' }), title: 'The wedding', lines: wl,
    links: [
      { label: dest ? 'Hotel → venue (Google)' : 'Directions (Google)', href: dest ? dest.googleDirections : v.googleDirections },
      { label: 'Apple Maps', href: dest ? dest.appleDirections : v.appleDirections },
    ],
  });

  // departure
  const dl: string[] = [];
  const dlinks: { label: string; href: string }[] = [];
  if (ap) {
    const driveMin = dest?.fromAirport[ap.code]?.minutes ?? ap.toVenue.minutes;
    const total = Math.ceil((driveMin + 120 + (rental ? 30 : 0)) / 15) * 15;
    dl.push(`${dest ? dest.name : v.name} to ${ap.code}: about ${dur(driveMin)} in typical conditions.`);
    dl.push(`Rule of thumb: leave about ${dur(total)} before a domestic flight departs (drive time, ${rental ? 'rental-car return and shuttle, ' : ''}and arriving about two hours early). Your airline’s advice takes priority.`);
    dlinks.push({ label: 'To airport (Google)', href: gDir(dest ? `${dest.name}, ${dest.address}` : `${v.name}, ${v.address}`, ap.name) });
  } else {
    dl.push(t.from ? `Head home to ${t.from}.` : 'Safe travels home.');
    if (t.from) dlinks.push({ label: 'Directions home (Google)', href: gDir(dest ? `${dest.name}, ${dest.address}` : v.address, t.from) });
  }
  out.push({ when: fmtDate(t.checkout), title: 'Head home', lines: dl, links: dlinks });
  return out;
}

function itineraryText(data: ConciergeData, it: Stop[]): string {
  const rows = [`YOUR WEDDING WEEKEND — ${data.couple}, ${data.dateLong}`, `${data.venue.name}, ${data.venue.address}`, 'Times are estimates under typical conditions, not live traffic.', ''];
  it.forEach((s) => {
    rows.push(`${s.when.toUpperCase()} — ${s.title}`, ...s.lines.map((l) => `  ${l}`));
    s.links?.forEach((l) => rows.push(`  ${l.label}: ${l.href}`));
    rows.push('');
  });
  return rows.join('\n');
}
