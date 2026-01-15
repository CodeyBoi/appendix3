import { shuffle, zip } from 'utils/array';
import {
  Alignment,
  CHARACTER_TYPES,
  CharacterId,
  CharacterType,
  Edition,
  getDefaultAlignment,
  getType,
  Reminder,
} from './characters';

export class BotcGame {
  edition: Edition;
  lobby: { name: string; corpsId?: string }[];
  players: BotcPlayer[];

  constructor(initial: {
    edition: Edition;
    lobby?: { name: string; corpsId?: string }[];
    players?: BotcPlayer[];
  }) {
    this.edition = initial.edition;
    this.lobby = initial.lobby ?? [];
    this.players = initial.players ?? [];
  }

  static fromJSON(json: string) {
    interface BotcMetadata {
      id: string;
      author: string;
      name: string;
    }
    const [meta, ...characters]: [BotcMetadata, ...CharacterId[]] = JSON.parse(
      json,
    ) as [BotcMetadata, ...CharacterId[]];
    const id = meta.id;
    const name = meta.name;
    const edition = characters.reduce<Edition>(
      (acc, id) => {
        acc[getType(id)].push(id);
        return acc;
      },
      {
        id,
        name,
        townsfolk: [],
        outsiders: [],
        minions: [],
        demons: [],
        travellers: [],
      },
    );
    return new BotcGame({ edition });
  }

  characters() {
    return CHARACTER_TYPES.flatMap((t) => this.edition[t]);
  }

  assignCharacters(characters: CharacterId[]) {
    this.players = zip(shuffle(characters.slice()), this.lobby).map(
      ([characterId, player], index) =>
        new BotcPlayer({ ...player, characterId, index }),
    );
  }
}

// interface Neighbours {
//   left?: BotcPlayer;
//   right?: BotcPlayer;
// }

const getNeighbours = (
  players: BotcPlayer[],
  index: number,
  filter: (p: BotcPlayer) => boolean = () => true,
) => {
  let left;
  for (let i = 1; i < players.length; i++) {
    const currentIndex = (index + players.length - i) % players.length;
    const currentPlayer = players[currentIndex];
    if (!currentPlayer)
      throw new Error('Invalid index when searching for left neighbour');
    if (filter(currentPlayer)) {
      left = currentPlayer;
      break;
    }
  }
  let right;
  for (let i = 1; i < players.length; i++) {
    const currentIndex = (index + i) % players.length;
    const currentPlayer = players[currentIndex];
    if (!currentPlayer)
      throw new Error('Invalid index when searching for right neighbour');
    if (filter(currentPlayer)) {
      right = currentPlayer;
      break;
    }
  }

  return { left, right };
};

export class BotcPlayer {
  name?: string;
  characterId: CharacterId;
  index: number;
  alignment: Alignment;
  corpsId?: string;
  reminders: Reminder[];
  automaticReminders: Reminder[];
  isAlive: boolean;
  isDrunk: boolean;
  isPoisoned: boolean;
  hasVoteToken: boolean;

  constructor({
    name,
    corpsId,
    characterId,
    index,
  }: {
    name?: string;
    corpsId?: string;
    characterId: CharacterId;
    index: number;
  }) {
    this.name = name;
    this.corpsId = corpsId;
    this.characterId = characterId;
    this.index = index;
    this.reminders = [];
    this.automaticReminders = [];
    this.alignment = getDefaultAlignment(characterId);
    this.isAlive = true;
    this.isDrunk = false;
    this.isPoisoned = false;
    this.hasVoteToken = true;
  }

  isAbilityActive() {
    return !this.isDrunk && !this.isPoisoned;
  }

  type(): CharacterType {
    return getType(this.characterId);
  }

  getNeighbours(
    players: BotcPlayer[],
    filter: (p: BotcPlayer) => boolean = () => true,
  ) {
    return getNeighbours(players, this.index, filter);
  }

  addAutomaticReminders(game: BotcGame) {
    if (!this.isAbilityActive()) {
      return;
    }
    switch (this.characterId) {
      case 'empath': {
        const neighbours = this.getNeighbours(game.players, (p) => p.isAlive);
        const numberOfEvilNeighbours =
          (neighbours.left && neighbours.left.alignment === 'evil' ? 1 : 0) +
          (neighbours.right && neighbours.right.alignment === 'evil' ? 1 : 0);
        this.automaticReminders.push({
          characterId: 'empath',
          message: `${numberOfEvilNeighbours} evil neighbours`,
        });

        break;
      }
    }
  }
}
