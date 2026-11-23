/** Photograph slugs. Alt text and captions are language-specific and live in the dictionaries (src/i18n/*.ts → photos). */
export const photoSlugs = [
  'proposal-hands', 'proposal-moment', 'proposal-laughing', 'proposal-kiss',
  'early-aprons', 'early-cart', 'early-couch', 'early-luggage', 'early-airport',
] as const;
export type PhotoSlug = (typeof photoSlugs)[number];
