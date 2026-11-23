export const enc = encodeURIComponent;
export const num = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) && n >= 0 ? n : 0; };
export const gDir = (from: string, to: string) => `https://www.google.com/maps/dir/?api=1&origin=${enc(from)}&destination=${enc(to)}&travelmode=driving`;
export const aDir = (from: string, to: string) => `https://maps.apple.com/?saddr=${enc(from)}&daddr=${enc(to)}&dirflg=d`;
