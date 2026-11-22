export const dur = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}`);
export const mi = (n: number) => `${n.toFixed(1).replace(/\.0$/, '')} mi`;
export const enc = encodeURIComponent;
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', opts);
export const nightsBetween = (a: string, b: string) => Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 864e5));
export const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const num = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) && n >= 0 ? n : 0; };
export const gDir = (from: string, to: string) => `https://www.google.com/maps/dir/?api=1&origin=${enc(from)}&destination=${enc(to)}&travelmode=driving`;
export const aDir = (from: string, to: string) => `https://maps.apple.com/?saddr=${enc(from)}&daddr=${enc(to)}&dirflg=d`;
