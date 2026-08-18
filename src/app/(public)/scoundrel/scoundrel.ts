import { filterNone, range, shuffle } from 'utils/array';
import { Card, Rank, RANKS } from 'utils/card';

const STARTING_DECK = range(2, 11)
  .flatMap((rank) =>
    ['heart', 'diamond'].map((suit) => ({ rank, suit }) as Card),
  )
  .concat(
    RANKS.flatMap((rank) =>
      ['club', 'spade'].map((suit) => ({ rank, suit }) as Card),
    ),
  );

interface Weapon {
  strength: Rank;
  monsterStrengthLimit?: number;
}
export type Room = [
  Card | undefined,
  Card | undefined,
  Card | undefined,
  Card | undefined,
];

const MAX_HEALTH = 20;

export const getMonsterStrength = (rank: Rank) => (rank === 1 ? 14 : rank);

const isMonster = (card: Card) => ['spade', 'club'].includes(card.suit);

export class ScoundrelGame {
  deck: Card[];
  room: Room;
  health: number;
  equippedWeapon?: Weapon;
  hasDrunkInRoom: boolean;
  hasSkipped: boolean;

  constructor(initial?: {
    deck: Card[];
    room: Room;
    health: number;
    equippedWeapon?: Weapon;
    hasDrunkInRoom: boolean;
    hasSkipped: boolean;
  }) {
    this.deck = initial?.deck ?? shuffle(STARTING_DECK.slice());
    this.room = initial?.room ?? [undefined, undefined, undefined, undefined];
    this.health = initial?.health ?? MAX_HEALTH;
    this.equippedWeapon = initial?.equippedWeapon
      ? { ...initial.equippedWeapon }
      : undefined;
    this.hasDrunkInRoom = initial?.hasDrunkInRoom ?? false;
    this.hasSkipped = initial?.hasSkipped ?? false;
  }

  fillRoom() {
    if (this.deck.length < this.room.length - filterNone(this.room).length) {
      // There are not enough cards in the deck to fill the room
      return 'complete';
    }
    this.hasDrunkInRoom = false;
    this.hasSkipped = false;
    for (let i = 0; i < this.room.length; i++) {
      const roomCard = this.room[i];
      if (roomCard) {
        continue;
      }
      this.room[i] = this.drawCard();
    }
  }

  drawCard() {
    return this.deck.pop();
  }

  heal(amount: number) {
    if (this.hasDrunkInRoom) {
      return;
    }
    this.health = Math.min(this.health + amount, MAX_HEALTH);
    this.hasDrunkInRoom = true;
  }

  takeDamage(amount: number) {
    this.health -= amount;
  }

  equipWeapon(strength: Rank) {
    this.equippedWeapon = { strength };
  }

  removeRoomCard(index: number) {
    this.room[index] = undefined;
  }

  killMonster(strength: number, useWeapon: boolean) {
    if (
      useWeapon &&
      this.equippedWeapon &&
      (!this.equippedWeapon.monsterStrengthLimit ||
        this.equippedWeapon.monsterStrengthLimit > strength)
    ) {
      this.equippedWeapon.monsterStrengthLimit = strength;
      this.takeDamage(Math.max(strength - this.equippedWeapon.strength, 0));
      return 'weapon';
    } else {
      this.takeDamage(strength);
      return 'unarmed';
    }
  }

  skipRoom() {
    const filteredRoom = filterNone(this.room);
    if (filteredRoom.length !== this.room.length) {
      // Cannot skip if room has been started
      return;
    }
    // Place room cards shuffled on the bottom of the deck
    this.deck = shuffle(filteredRoom).concat(this.deck);
    this.room = [undefined, undefined, undefined, undefined];

    // Redraw room
    this.fillRoom();

    this.hasSkipped = true;
  }

  remainingMonsterStrength() {
    return this.deck
      .concat(filterNone(this.room))
      .reduce(
        (acc, card) =>
          acc + (isMonster(card) ? getMonsterStrength(card.rank) : 0),
        0,
      );
  }

  calculateScore() {
    if (this.health <= 0) {
      return this.health - this.remainingMonsterStrength();
    } else if (this.health === 20) {
      return (
        this.health +
        Math.max(
          ...filterNone(this.room).map((card) =>
            card.suit === 'heart' ? card.rank : 0,
          ),
          0,
        )
      );
    } else {
      return this.health;
    }
  }
}
