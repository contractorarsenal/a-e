import { useEffect, useRef } from 'react';
import type { ConciergeData } from './types';
import { useI18n } from './i18n';

type Props = { data: ConciergeData; selectedId: string | null; airport: string | null; showAirportRoute: boolean; onSelect: (id: string) => void };

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function MapView({ data, selectedId, airport, showAirportRoute, onSelect }: Props) {
  const { t, fmt } = useI18n();
  const el = useRef<HTMLDivElement>(null);
  const state = useRef<any>({});
  const drawRef = useRef<() => void>(() => {});

  // initialise once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !el.current) return;
      const map = L.map(el.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true, tap: true } as any);
      L.control.zoom({ position: 'bottomright', zoomInTitle: t.zoomIn, zoomOutTitle: t.zoomOut }).addTo(map);
      // OpenStreetMap standard tiles: no API key, fine for a low-traffic site with attribution.
      // For heavy traffic or a custom style swap this URL for a provider such as Mapbox, Stadia or MapTiler (needs a public key).
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: t.mapAttribution,
        maxZoom: 18,
      }).addTo(map);
      const v = data.venue;
      const venueIcon = L.divIcon({ className: '', html: `<div class="ae-pin ae-pin-venue"><span>A+E</span></div>`, iconSize: [46, 46], iconAnchor: [23, 23] });
      const venueMarker = L.marker([v.lat, v.lon], { icon: venueIcon, title: v.name, keyboard: true, zIndexOffset: 1000 }).addTo(map)
        .bindTooltip(v.name, { direction: 'top', offset: [0, -22], className: 'ae-tip' });
      const markers: Record<string, any> = {};
      data.hotels.forEach((h, i) => {
        const m = L.marker([h.lat, h.lon], { icon: L.divIcon({ className: '', html: `<div class="ae-pin ae-pin-hotel" data-id="${h.id}"><span>${i + 1}</span></div>`, iconSize: [32, 32], iconAnchor: [16, 16] }), title: h.name, keyboard: true, alt: h.name })
          .addTo(map).bindTooltip(h.name, { direction: 'top', offset: [0, -14], className: 'ae-tip' });
        m.on('click', () => onSelect(h.id));
        markers[h.id] = m;
      });
      const bounds = L.latLngBounds([[v.lat, v.lon], ...data.hotels.map((h) => [h.lat, h.lon] as [number, number])]);
      map.fitBounds(bounds, { padding: [40, 40], animate: false });
      state.current = { L, map, markers, venueMarker, bounds, layers: [] as any[] };
      setTimeout(() => map.invalidateSize(), 50);
      drawRef.current(); // latest props (a saved hotel may have been restored while the map was loading)
    })();
    return () => { cancelled = true; state.current.map?.remove(); state.current = {}; };
  }, []);

  function draw() {
    const s = state.current; if (!s.map) return;
    const { L, map } = s;
    s.layers.forEach((l: any) => l.remove()); s.layers = [];
    document.querySelectorAll('.ae-pin-hotel').forEach((n) => n.classList.toggle('is-selected', (n as HTMLElement).dataset.id === selectedId));
    const pts: [number, number][] = [[data.venue.lat, data.venue.lon]];
    const h = data.hotels.find((x) => x.id === selectedId);
    if (h) {
      const path = h.toVenue.path;
      const line = L.polyline(path, { color: '#9a4a31', weight: 4, opacity: 0.9, lineCap: 'round', className: 'ae-route' }).addTo(map);
      s.layers.push(line); pts.push(...path);
    }
    const a = data.airports.find((x) => x.code === airport);
    if (a && showAirportRoute) {
      const line = L.polyline(a.toVenue.path, { color: '#a99c8d', weight: 3, dashArray: '2 8', opacity: 0.95, lineCap: 'round' }).addTo(map);
      const mk = L.marker([a.lat, a.lon], { icon: L.divIcon({ className: '', html: `<div class="ae-pin ae-pin-air"><span>${a.code}</span></div>`, iconSize: [44, 26], iconAnchor: [22, 13] }), title: a.name }).addTo(map);
      s.layers.push(line, mk); pts.push([a.lat, a.lon]);
    }
    const b = pts.length > 1 ? L.latLngBounds(pts) : s.bounds;
    const opts = { padding: [48, 48] as [number, number], maxZoom: 14 };
    if (reduced()) map.fitBounds(b, { ...opts, animate: false });
    else map.flyToBounds(b, { ...opts, duration: 0.9 });
  }

  drawRef.current = draw;
  useEffect(draw, [selectedId, airport, showAirportRoute]);

  // keep Leaflet sized correctly when its container is shown/hidden or resized
  useEffect(() => {
    if (!el.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => state.current.map?.invalidateSize());
    ro.observe(el.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-champagne/50">
      <div ref={el} className="ae-map h-full w-full" role="region" aria-label={fmt(t.mapLabel, { venue: data.venue.name })} />
      <p className="pointer-events-none absolute left-3 top-3 z-[500] bg-ivory/90 px-3 py-1.5 text-sm font-semibold text-taupe">{t.mapBadge}</p>
    </div>
  );
}
