import { BingoCard, BingoCardEntry, BingoEntry } from '@prisma/client';

type ClientBingoCard = BingoCard & {
  entries: (BingoCardEntry & {
    entry: BingoEntry;
  })[];
};

export type { ClientBingoCard };
