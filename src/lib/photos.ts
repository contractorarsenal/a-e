/** Accessible descriptions for each photograph. Edit here; used site-wide. */
export const photos = {
  'proposal-hands': {
    alt: 'On a sunlit beach, one partner kneels in the sand holding the other’s hands, both smiling and wearing flower leis, with green mountains and the ocean behind them.',
    caption: 'Hands held, ring on.',
  },
  'proposal-moment': {
    alt: 'One partner kneels on the sand with a ring box open while the other, in an orange dress and a plumeria lei, reacts with delight. Mountains rise behind the beach.',
    caption: 'The question.',
  },
  'proposal-laughing': {
    alt: 'Laughing with joy, one partner holds out a ring while the other, in an orange dress and flower lei, laughs back on a golden beach with the surf rolling in.',
    caption: 'The answer, mostly laughter.',
  },
  'proposal-kiss': {
    alt: 'The couple, in flower leis, kiss on the beach at golden hour with the ocean and a blue sky behind them. Her ring is visible on the hand at his cheek.',
    caption: 'Golden hour, newly engaged.',
  },
} as const;
export type PhotoSlug = keyof typeof photos;
