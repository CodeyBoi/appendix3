import { chooseRandom, shuffle } from 'utils/array';
import {
  Alignment,
  CHARACTER_TYPES,
  CharacterId,
  CharacterType,
  Edition,
  getDefaultAlignment,
  getType,
  Reminder,
  START_OF_GAME_ABILITIES,
} from './characters';

export class BotcGame {
  edition: Edition;
  players: BotcPlayer[];
  demonBluffs: CharacterId[];

  constructor(initial: {
    edition: Edition;
    players?: BotcPlayer[];
    demonBluffs?: CharacterId[];
  }) {
    this.edition = initial.edition;
    this.players = initial.players ?? [];
    this.demonBluffs = initial.demonBluffs ?? [];
  }

  startGame({ players: playersArg }: { players: BotcPlayer[] }) {
    const scriptCharacters = this.scriptCharacters();
    let players = BotcPlayers.fromArray(playersArg.slice());
    playersArg.forEach((player, i) => {
      const startOfGameAbility = START_OF_GAME_ABILITIES[player.characterId];
      if (startOfGameAbility) {
        players = startOfGameAbility({
          players,
          playerId: player.id,
          playerIndex: i,
          scriptCharacters,
        });
      }
    });

    this.players = players;
    this.demonBluffs = this.generateDemonBluffs();
  }

  scriptCharacters() {
    return CHARACTER_TYPES.flatMap((t) => this.edition[t]);
  }

  charactersInPlay() {
    return this.players.map((p) => p.characterId);
  }

  assignCharacters(characters: CharacterId[]) {
    this.players = shuffle(characters.slice()).map(
      (characterId, index) => new BotcPlayer({ characterId, id: index }),
    );
  }

  generateDemonBluffs(numberOfBluffs: number = 3) {
    const chosenCharacterSet = new Set(this.charactersInPlay());
    const validTownsfolk = shuffle(
      this.edition.townsfolk.filter((t) => !chosenCharacterSet.has(t)),
    );
    const validOutsiders = this.edition.outsiders.filter(
      (t) => !chosenCharacterSet.has(t),
    );

    const outsiderBluff = chooseRandom(validOutsiders);

    if (!outsiderBluff || numberOfBluffs === 1) {
      return validTownsfolk.slice(0, numberOfBluffs);
    } else {
      const bluffs = validTownsfolk.slice(0, numberOfBluffs - 1);
      bluffs.push(outsiderBluff);
      return bluffs;
    }
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
  id: number;
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
    id,
  }: {
    name?: string;
    corpsId?: string;
    characterId: CharacterId;
    id: number;
  }) {
    this.name = name;
    this.corpsId = corpsId;
    this.characterId = characterId;
    this.id = id;
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
    return getNeighbours(players, this.id, filter);
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

  isGood(): boolean {
    const getIsGood = () => {
      switch (this.characterId) {
        case 'spy': {
          return true;
        }
        case 'recluse': {
          return false;
        }
        case 'badomen': {
          return false;
        }
        default: {
          return this.alignment === 'good';
        }
      }
    };
    const registersAsOppositeAlignment =
      this.reminders.find(
        (reminder) =>
          reminder.characterId === 'glykon' &&
          reminder.message === 'Snake bite',
      ) !== undefined;
    return registersAsOppositeAlignment ? !getIsGood() : getIsGood();
  }

  isEvil(): boolean {
    const getIsEvil = () => {
      switch (this.characterId) {
        case 'spy': {
          return false;
        }
        case 'recluse': {
          return true;
        }
        case 'badomen': {
          return true;
        }
        default: {
          return this.alignment === 'evil';
        }
      }
    };
    const registersAsOppositeAlignment =
      this.reminders.find(
        (reminder) =>
          reminder.characterId === 'glykon' &&
          reminder.message === 'Snake bite',
      ) !== undefined;
    return registersAsOppositeAlignment ? !getIsEvil() : getIsEvil();
  }

  isCharacterType(characterType: CharacterType): boolean {
    const thisType = getType(this.characterId);
    if (thisType === 'travellers') {
      return thisType === characterType;
    }

    switch (this.characterId) {
      case 'spy': {
        return characterType === 'townsfolk' || characterType === 'outsiders';
      }
      case 'recluse': {
        return characterType === 'minions' || characterType === 'demons';
      }
      case 'spartacus': {
        return characterType === 'townsfolk';
      }
      default: {
        return thisType === characterType;
      }
    }
  }
}

export class BotcPlayers extends Array<BotcPlayer> {
  constructor(players: BotcPlayer[] = []) {
    super();
    Object.setPrototypeOf(this, BotcPlayers.prototype);
    for (const player of players) {
      this.push(player);
    }
  }

  static fromArray(players: BotcPlayer[]) {
    return new BotcPlayers(players);
  }

  // Needed to have map, filter, etc. return an ordinary Array instead of BotcPlayers
  static get [Symbol.species]() {
    return Array;
  }

  chooseRandom({
    characterType,
    alignment,
    excludeId,
    excludeIds = [],
    excludeIndex,
    excludeIndexes = [],
  }: {
    characterType?: CharacterType;
    alignment?: Alignment;
    excludeId?: number;
    excludeIds?: number[];
    excludeIndex?: number;
    excludeIndexes?: number[];
  }) {
    const excludeIdSet = new Set(excludeIds);
    if (excludeId !== undefined) {
      excludeIdSet.add(excludeId);
    }
    const excludeIndexSet = new Set(excludeIndexes);
    if (excludeIndex !== undefined) {
      excludeIndexSet.add(excludeIndex);
    }
    const filterFunc = (p: BotcPlayer, i: number) =>
      !excludeIdSet.has(p.id) &&
      !excludeIndexSet.has(i) &&
      (characterType === undefined || p.isCharacterType(characterType)) &&
      (alignment === undefined ||
        (alignment === 'good' ? p.isGood() : p.isEvil()));

    return chooseRandom(this.filter(filterFunc));
  }
}
