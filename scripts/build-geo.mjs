// Builds src/generated/geo.json: coordinates + real road distances/times for the travel concierge.
//   Geocoding : OpenStreetMap Nominatim (1 req/s, one-time)
//   Routing   : OSRM public demo server on OpenStreetMap data (typical conditions, NO live traffic)
// For production-grade live routing set MAPBOX_TOKEN or GOOGLE_MAPS_API_KEY on the server (see /api/route).
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const places = JSON.parse(await readFile(path.join(root, 'src/content/places.json'), 'utf8'));
const UA = 'wedding-site-build/1.0';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  const j = await res.json();
  await sleep(1300);
  if (!j[0]) throw new Error('No geocode result for ' + q);
  return { lat: +(+j[0].lat).toFixed(6), lon: +(+j[0].lon).toFixed(6), matched: j[0].display_name };
}

const hotels = {}, airports = {};
for (const h of places.hotels) { hotels[h.id] = { ...(await geocode(h.query)), source: 'OpenStreetMap Nominatim (geocoded from street address; pin is approximate)' }; console.log(h.id, hotels[h.id].lat, hotels[h.id].lon); }
for (const a of places.airports) { airports[a.id] = { name: a.name, ...(await geocode(a.query)), source: 'OpenStreetMap Nominatim' }; console.log(a.id, airports[a.id].lat, airports[a.id].lon); }

const V = places.venue;
const pt = (p) => `${p.lon},${p.lat}`;
async function route(a, b, geometry = false) {
  const url = `https://router.project-osrm.org/route/v1/driving/${pt(a)};${pt(b)}?overview=${geometry ? 'simplified' : 'false'}&geometries=geojson`;
  const j = await (await fetch(url, { headers: { 'user-agent': UA } })).json();
  await sleep(1100);
  if (j.code !== 'Ok') throw new Error('route failed ' + JSON.stringify(j).slice(0, 200));
  const r = j.routes[0];
  return {
    miles: +(r.distance / 1609.344).toFixed(1),
    minutes: Math.round(r.duration / 60),
    ...(geometry ? { path: r.geometry.coordinates.map(([lon, lat]) => [+lat.toFixed(5), +lon.toFixed(5)]) } : {}),
  };
}

const hotelToVenue = {}, airportToVenue = {}, airportToHotel = {};
for (const id of Object.keys(hotels)) { hotelToVenue[id] = await route(hotels[id], V, true); console.log('hotel→venue', id, hotelToVenue[id].miles, hotelToVenue[id].minutes); }
for (const id of Object.keys(airports)) {
  airportToVenue[id] = await route(airports[id], V, true);
  airportToHotel[id] = {};
  for (const hid of Object.keys(hotels)) airportToHotel[id][hid] = await route(airports[id], hotels[hid]);
  console.log('airport', id, airportToVenue[id].miles, airportToVenue[id].minutes);
}

await writeFile(
  path.join(root, 'src/generated/geo.json'),
  JSON.stringify({
    generatedAt: new Date().toISOString().slice(0, 10),
    provider: 'OSRM (OpenStreetMap road data)',
    note: 'Typical driving conditions, no live traffic. Use the Maps links for live times.',
    venue: V, hotels, airports, hotelToVenue, airportToVenue, airportToHotel,
  }, null, 1),
);
console.log('wrote geo.json');
