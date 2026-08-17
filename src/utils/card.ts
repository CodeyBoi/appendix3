export const SUITS = ['spade', 'heart', 'diamond', 'club'] as const;
export type Suit = (typeof SUITS)[number];

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type Rank = (typeof RANKS)[number];

export const rankToIcon = (rank: Rank) => {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return rank.toString();
  }
};

const SUIT_TO_ICON: Record<Suit, string> = {
  spade: '♠',
  heart: '♥',
  diamond: '♦',
  club: '♣',
};
export const suitToIcon = (suit: Suit) => {
  return SUIT_TO_ICON[suit];
};

const SUIT_TO_UNICODE_OFFSET: Record<Suit, number> = {
  spade: 0x1f0a0,
  heart: 0x1f0b0,
  diamond: 0x1f0c0,
  club: 0x1f0d0,
};
const rankToUnicodeOffset = (rank: Rank) => (rank <= 11 ? rank : rank + 1);
export const cardToString = (card: Card) =>
  String.fromCodePoint(
    SUIT_TO_UNICODE_OFFSET[card.suit] + rankToUnicodeOffset(card.rank),
  );

export interface Card {
  rank: Rank;
  suit: Suit;
}
