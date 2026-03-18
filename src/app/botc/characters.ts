import { BotcPlayer } from './blood-on-the-clocktower-game';

export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 15;

export const CHARACTER_TYPES = [
  'townsfolk',
  'outsiders',
  'minions',
  'demons',
  'travellers',
] as const;
export type CharacterType = (typeof CHARACTER_TYPES)[number];

export interface Edition {
  id: EditionId;
  name: string;
  townsfolk: CharacterId[];
  outsiders: CharacterId[];
  minions: CharacterId[];
  demons: CharacterId[];
  travellers: CharacterId[];
}

export const EDITIONS: readonly Edition[] = [
  {
    id: 'trouble-brewing',
    name: 'Trouble Brewing',
    townsfolk: [
      'washerwoman',
      'librarian',
      'investigator',
      'chef',
      'empath',
      'fortuneteller',
      'undertaker',
      'monk',
      'ravenkeeper',
      'virgin',
      'slayer',
      'soldier',
      'mayor',
    ],
    outsiders: ['butler', 'drunk', 'recluse', 'saint'],
    minions: ['poisoner', 'spy', 'scarletwoman', 'baron'],
    demons: ['imp'],
    travellers: ['bureaucrat', 'thief', 'gunslinger', 'scapegoat', 'beggar'],
  },
  {
    id: 'bad-moon-rising',
    name: 'Bad Moon Rising',
    townsfolk: [
      'grandmother',
      'sailor',
      'chambermaid',
      'exorcist',
      'innkeeper',
      'gambler',
      'gossip',
      'courtier',
      'professor',
      'minstrel',
      'tealady',
      'pacifist',
      'fool',
    ],
    outsiders: ['tinker', 'moonchild', 'goon', 'lunatic'],
    minions: ['godfather', 'devilsadvocate', 'assassin', 'mastermind'],
    demons: ['zombuul', 'pukka', 'shabaloth', 'po'],
    travellers: ['apprentice', 'matron', 'judge', 'bishop', 'voudon'],
  },
  {
    id: 'sects-and-violets',
    name: 'Sects and Violets',
    townsfolk: [
      'clockmaker',
      'dreamer',
      'snakecharmer',
      'mathematician',
      'flowergirl',
      'towncrier',
      'oracle',
      'savant',
      'seamstress',
      'philosopher',
      'artist',
      'juggler',
      'sage',
    ],
    outsiders: ['mutant', 'sweetheart', 'barber', 'klutz'],
    minions: ['eviltwin', 'witch', 'cerenovus', 'pithag'],
    demons: ['fanggu', 'vigormortis', 'nodashii', 'vortox'],
    travellers: ['barista', 'harlot', 'butcher', 'bonecollector', 'deviant'],
  },
  {
    id: 'fall-of-rome',
    name: 'Fall of Rome',
    townsfolk: [
      'sculptor',
      'vestalvirgin',
      'physician',
      'legionary',
      'trumpeter',
      'mortician',
      'standardbearer',
      'centurion',
      'merchant',
      'gladiator',
      'actor',
      'blacksmith',
      'scholar',
    ],
    outsiders: ['thetwins', 'winemaker', 'spartacus', 'badomen'],
    minions: ['temptress', 'haruspex', 'glykon', 'augur'],
    demons: ['cleopatra', 'crassus', 'hannibal', 'caesar'],
    travellers: [
      'mercenary',
      'architect',
      'sibyl',
      'highpriest',
      'highpriest2',
      'emperor',
    ],
  },
  {
    id: 'carousel',
    name: 'Carousel',
    townsfolk: [
      'acrobat',
      'alchemist',
      'alsaahir',
      'amnesiac',
      'atheist',
      'balloonist',
      'banshee',
      'bountyhunter',
      'cannibal',
      'choirboy',
      'cultleader',
      'engineer',
      'farmer',
      'fisherman',
      'general',
      'highpriestess',
      'huntsman',
      'king',
      'knight',
      'lycanthrope',
      'magician',
      'nightwatchman',
      'noble',
      'pixie',
      'poppygrower',
      'princess',
      'preacher',
      'shugenja',
      'steward',
      'villageidiot',
    ],
    outsiders: [
      'damsel',
      'golem',
      'heretic',
      'hermit',
      'hatter',
      'ogre',
      'plaguedoctor',
      'politician',
      'puzzlemaster',
      'snitch',
      'zealot',
    ],
    minions: [
      'boffin',
      'boomdandy',
      'fearmonger',
      'goblin',
      'harpy',
      'marionette',
      'mezepheles',
      'organgrinder',
      'summoner',
      'psychopath',
      'vizier',
      'widow',
      'wizard',
      'xaan',
      'wraith',
    ],
    demons: [
      'riot',
      'alhadikhia',
      'kazali',
      'legion',
      'leviathan',
      'lilmonsta',
      'lleech',
      'lordoftyphon',
      'ojo',
      'yaggababble',
    ],
    travellers: ['gangster', 'gnome'],
  },
] as const;

const _CHARACTER_TYPE_MAP = EDITIONS.reduce((acc, edition) => {
  console.log('Generating CharacterType Map');
  for (const type of CHARACTER_TYPES) {
    for (const characterId of edition[type]) {
      acc.set(characterId, type);
    }
  }
  return acc;
}, new Map<CharacterId, CharacterType>());
export const getType = (id: CharacterId) =>
  _CHARACTER_TYPE_MAP.get(id) ?? 'townsfolk';

export type Alignment = 'good' | 'evil';

const GOOD_CHARACTER_TYPES: CharacterType[] = ['townsfolk', 'outsiders'];
const EVIL_CHARACTER_TYPES: CharacterType[] = ['minions', 'demons'];

export const isGood = (t: CharacterType) => GOOD_CHARACTER_TYPES.includes(t);
export const isEvil = (t: CharacterType) => EVIL_CHARACTER_TYPES.includes(t);

export const getDefaultAlignment = (id: CharacterId): Alignment => {
  switch (getType(id)) {
    case 'townsfolk':
    case 'outsiders':
      return 'good';
    case 'minions':
    case 'demons':
      return 'evil';
    case 'travellers':
      return 'good';
  }
};

export const getEdition = (id: CharacterId): EditionId => {
  for (const edition of EDITIONS) {
    if (getAllCharacters(edition).includes(id)) {
      return edition.id;
    }
  }
  return 'custom';
};

const pocketGrimoireBaseUrl = 'https://www.pocketgrimoire.co.uk/en_GB/sheet';
export const toPocketGrimoireUrl = (edition: Edition) =>
  `${pocketGrimoireBaseUrl}?name=${edition.name.replaceAll(
    ' ',
    '+',
  )}&characters=${encodeURIComponent(getAllCharacters(edition).join(','))}`;

export const parsePocketGrimoireUrl = (url: string): Edition => {
  const searchParams = new URLSearchParams(url.split('?')[1]);
  console.log(searchParams);
  const name =
    searchParams.get('name')?.replaceAll('+', ' ') ?? 'Unknown Script';
  const id = 'custom';
  const characterIds = searchParams.get('characters')?.split(',') ?? [];
  const characters = characterIds.reduce<Record<CharacterType, CharacterId[]>>(
    (acc, id) => {
      const type = getType(id as CharacterId);
      acc[type].push(id as CharacterId);
      return acc;
    },
    {
      townsfolk: [],
      outsiders: [],
      minions: [],
      demons: [],
      travellers: [],
    },
  );
  return {
    id: id as EditionId,
    name,
    ...characters,
  };
};

export const getAllCharacters = (edition: Edition) =>
  CHARACTER_TYPES.flatMap((t) => edition[t]);

const ABBREVIATIONS: Record<string, string> = {
  'trouble-brewing': 'tb',
  'bad-moon-rising': 'bmr',
  'sects-and-violets': 'snv',
  carousel: 'carousel',
  custom: 'carousel',
};
const baseImgUrl = `https://script.bloodontheclocktower.com/src/assets/icons/<EDITION>/<NAME><ALIGNMENT>.webp`;
const fallOfRomeBaseImgUrl =
  'https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/<NAME>_fall_of_rome.png';
export const getImagePathFromId = (id: CharacterId) => {
  if (getEdition(id) === 'fall-of-rome') {
    // Centurion, Glykon and High Priest are stored at <name>1
    const name = ['centurion', 'glykon', 'highpriest'].includes(id)
      ? `${id}1`
      : id;
    return fallOfRomeBaseImgUrl.replace('<NAME>', name);
  } else {
    return baseImgUrl
      .replace('<EDITION>', ABBREVIATIONS[getEdition(id)] ?? '')
      .replace('<NAME>', id)
      .replace(
        '<ALIGNMENT>',
        getType(id) === 'travellers'
          ? ''
          : '_' + getDefaultAlignment(id).slice(0, 1),
      );
  }
};

export const EDITION_IDS = [
  'trouble-brewing',
  'bad-moon-rising',
  'sects-and-violets',
  'fall-of-rome',
  'carousel',
  'custom',
] as const;
export type EditionId = (typeof EDITION_IDS)[number];

export type AbilityEffects =
  | 'Drunk'
  | 'Safe from Demon'
  | 'Cannot die'
  | 'Killed by'
  | 'Poisoned'
  | 'Alive'
  | 'Safe from execution';

export interface BotcCharacter {
  id: CharacterId;
  name: string;
  description: string;
  reminderTokens?: readonly string[];
  setupFunction?: (players: BotcPlayer[]) => BotcPlayer[];
}

// const chooseRandom = (players: BOTCPlayer[], filter: (player: BOTCPlayer) => boolean) => {
//   const validPlayers = players.filter(filter)
//   if (validPlayers.length === 0) throw new Error('Error when choosing random from ' + JSON.stringify(players));
//   return validPlayers[Math.floor(Math.random() * validPlayers.length)]
// }

const _characters = {
  // Trouble Brewing - Townsfolk
  washerwoman: {
    name: 'Washerwoman',
    description:
      'You start knowing that 1 of 2 players is a particular Townsfolk.',
    reminderTokens: ['Townsfolk', 'Wrong'],
  },
  librarian: {
    name: 'Librarian',
    description:
      'You start knowing that 1 of 2 players is a particular Outsider.',
    reminderTokens: ['Outsider', 'Wrong'],
  },
  investigator: {
    name: 'Investigator',
    description:
      'You start knowing that 1 of 2 players is a particular Minion.',
    reminderTokens: ['Minion', 'Wrong'],
  },
  chef: {
    name: 'Chef',
    description: 'You start knowing how many pairs of evil players there are.',
  },
  empath: {
    name: 'Empath',
    description:
      'Each night, you learn how many of your 2 alive neighbors are evil.',
  },
  fortuneteller: {
    name: 'Fortune Teller',
    description:
      'Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.',
    reminderTokens: ['Red herring'],
  },
  undertaker: {
    name: 'Undertaker',
    description:
      'Each night*, you learn which character died by execution today.',
    reminderTokens: ['Executed'],
  },
  monk: {
    name: 'Monk',
    description:
      'Each night*, choose a player (not yourself): they are safe from the Demon tonight.',
    reminderTokens: ['Safe from Demon'],
  },
  ravenkeeper: {
    name: 'Ravenkeeper',
    description:
      'If you die at night, you are woken to choose a player: you learn their character.',
  },
  virgin: {
    name: 'Virgin',
    description:
      'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.',
    reminderTokens: ['No ability'],
  },
  slayer: {
    name: 'Slayer',
    description:
      'Once per game, during the day, publicly choose a player: if they are the Demon, they die.',
    reminderTokens: ['No ability'],
  },
  soldier: {
    name: 'Soldier',
    description: 'You are safe from the Demon.',
  },
  mayor: {
    name: 'Mayor',
    description:
      'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.',
  },

  // Trouble Brewing - Outsiders
  butler: {
    name: 'Butler',
    description:
      'Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.',
    reminderTokens: ['Master'],
  },
  drunk: {
    name: 'Drunk',
    description:
      'You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.',
  },
  recluse: {
    name: 'Recluse',
    description:
      'You might register as evil & as a Minion or Demon, even if dead.',
  },
  saint: {
    name: 'Saint',
    description: 'If you die by execution, your team loses.',
  },

  // Trouble Brewing - Minions
  poisoner: {
    name: 'Poisoner',
    description:
      'Each night, choose a player: they are poisoned tonight and tomorrow day.',
    reminderTokens: ['Poisoned'],
  },
  spy: {
    name: 'Spy',
    description:
      'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.',
  },
  scarletwoman: {
    name: 'Scarlet Woman',
    description:
      "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count.)",
    reminderTokens: ['Is the Demon'],
  },
  baron: {
    name: 'Baron',
    description: 'There are extra Outsiders in play. [+2 Outsiders]',
  },

  // Trouble Brewing - Demons
  imp: {
    name: 'Imp',
    description:
      'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.',
    reminderTokens: ['Killed by'],
  },

  // Trouble Brewing - Travelers
  bureaucrat: {
    name: 'Bureaucrat',
    description:
      'Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.',
    reminderTokens: ['Vote counts as 3'],
  },
  thief: {
    name: 'Thief',
    description:
      'Each night, choose a player (not yourself): their vote counts negatively tomorrow.',
    reminderTokens: ['Vote counts negative'],
  },
  gunslinger: {
    name: 'Gunslinger',
    description:
      'Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.',
  },
  scapegoat: {
    name: 'Scapegoat',
    description:
      'If a player of your alignment is executed, you might be executed instead.',
  },
  beggar: {
    name: 'Beggar',
    description:
      'You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober & healthy.',
  },

  // Bad Moon Rising - Townsfolk
  grandmother: {
    name: 'Grandmother',
    description:
      'You start knowing a good player & their character. If the Demon kills them, you die too.',
    reminderTokens: ['Grandchild'],
  },
  sailor: {
    name: 'Sailor',
    description:
      "Each night, choose an alive player: either you or they are drunk until dusk. You can't die.",
    reminderTokens: ['Drunk'],
  },
  chambermaid: {
    name: 'Chambermaid',
    description:
      'Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.',
  },
  exorcist: {
    name: 'Exorcist',
    description:
      "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight.",
    reminderTokens: ['Chosen last night'],
  },
  innkeeper: {
    name: 'Innkeeper',
    description:
      "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk.",
    reminderTokens: ['Cannot die', 'Drunk'],
  },
  gambler: {
    name: 'Gambler',
    description:
      'Each night*, choose a player & guess their character: if you guess wrong, you die.',
    reminderTokens: ['Killed by'],
  },
  gossip: {
    name: 'Gossip',
    description:
      'Each day, you may make a public statement. Tonight, if it was true, a player dies.',
    reminderTokens: ['Killed by'],
  },
  courtier: {
    name: 'Courtier',
    description:
      'Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.',
    reminderTokens: [
      'No ability',
      'Drunk 1st night',
      'Drunk 2nd night',
      'Drunk until dusk',
    ],
  },
  professor: {
    name: 'Professor',
    description:
      'Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.',
    reminderTokens: ['Alive', 'No ability'],
  },
  minstrel: {
    name: 'Minstrel',
    description:
      'When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.',
    reminderTokens: ['Everyone drunk'],
  },
  tealady: {
    name: 'Tea Lady',
    description: "If both your alive neighbors are good, they can't die.",
    reminderTokens: ['Cannot die'],
  },
  pacifist: {
    name: 'Pacifist',
    description: 'Executed good players might not die.',
  },
  fool: {
    name: 'Fool',
    description: "The 1st time you die, you don't.",
    reminderTokens: ['No ability'],
  },

  // Bad Moon Rising - Outsiders
  tinker: {
    name: 'Tinker',
    description: 'You might die at any time.',
    reminderTokens: ['Killed by'],
  },
  moonchild: {
    name: 'Moonchild',
    description:
      'When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.',
    reminderTokens: ['Will die'],
  },
  goon: {
    name: 'Goon',
    description:
      'Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.',
    reminderTokens: ['Drunk'],
  },
  lunatic: {
    name: 'Lunatic',
    description:
      'You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.',
    reminderTokens: ['Attack 1', 'Attack 2', 'Attack 3'],
  },

  // Bad Moon Rising - Minions
  godfather: {
    name: 'Godfather',
    description:
      'You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]',
    reminderTokens: ['Died today', 'Killed by'],
  },
  devilsadvocate: {
    name: "Devil's Advocate",
    description:
      "Each night, choose a living player (different to last night): if executed tomorrow, they don't die.",
    reminderTokens: ['Safe from execution'],
  },
  assassin: {
    name: 'Assassin',
    description:
      'Once per game, at night*, choose a player: they die, even if for some reason they could not.',
    reminderTokens: ['Killed by', 'No ability'],
  },
  mastermind: {
    name: 'Mastermind',
    description:
      'If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.',
    reminderTokens: ['Final day'],
  },

  // Bad Moon Rising - Demons
  zombuul: {
    name: 'Zombuul',
    description:
      'Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.',
    reminderTokens: ['Died today', 'Killed by'],
  },
  pukka: {
    name: 'Pukka',
    description:
      'Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.',
    reminderTokens: ['Poisoned', 'Killed by'],
  },
  shabaloth: {
    name: 'Shabaloth',
    description:
      'Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.',
    reminderTokens: ['Killed by', 'Alive'],
  },
  po: {
    name: 'Po',
    description:
      'Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.',
    reminderTokens: ['Killed by', '3 attacks'],
  },

  // Bad Moon Rising - Travellers
  apprentice: {
    name: 'Apprentice',
    description:
      'On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil).',
  },
  matron: {
    name: 'Matron',
    description:
      'Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.',
  },
  judge: {
    name: 'Judge',
    description:
      'Once per game, if another player nominated, you may choose to force the current execution to pass or fail.',
    reminderTokens: ['No ability'],
  },
  bishop: {
    name: 'Bishop',
    description:
      'Only the Storyteller can nominate. At least 1 opposing player must be nominated each day.',
  },
  voudon: {
    name: 'Voudon',
    description:
      "Only you & the dead can vote. They don't need a vote token to do so. A 50% majority isn't required.",
  },

  // Sects and Violets - Townsfolk
  clockmaker: {
    name: 'Clockmaker',
    description:
      'You start knowing how many steps from the Demon to its nearest Minion.',
  },
  dreamer: {
    name: 'Dreamer',
    description:
      'Each night, choose a player (not yourself or Travellers): you learn 1 good & 1 evil character, 1 of which is correct.',
  },
  snakecharmer: {
    name: 'Snake Charmer',
    description:
      'Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.',
    reminderTokens: ['Poisoned'],
  },
  mathematician: {
    name: 'Mathematician',
    description:
      "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability.",
    reminderTokens: ['Worked abnormally'],
  },
  flowergirl: {
    name: 'Flowergirl',
    description: 'Each night*, you learn if a Demon voted today.',
    reminderTokens: ['Demon voted', 'Demon not voted'],
  },
  towncrier: {
    name: 'Town Crier',
    description: 'Each night*, you learn if a Minion nominated today.',
    reminderTokens: ['Minion has nominated', 'Minion has not nominated'],
  },
  oracle: {
    name: 'Oracle',
    description: 'Each night*, you learn how many dead players are evil.',
  },
  savant: {
    name: 'Savant',
    description:
      'Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.',
  },
  seamstress: {
    name: 'Seamstress',
    description:
      'Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment.',
    reminderTokens: ['No ability', 'Same alignment', 'Different alignment'],
  },
  philosopher: {
    name: 'Philosopher',
    description:
      'Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk.',
    reminderTokens: ['Drunk'],
  },
  artist: {
    name: 'Artist',
    description:
      'Once per game, during the day, privately ask the Storyteller any yes/no question.',
    reminderTokens: ['No ability'],
  },
  juggler: {
    name: 'Juggler',
    description:
      "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct.",
    reminderTokens: ['Correct'],
  },
  sage: {
    name: 'Sage',
    description: 'If the Demon kills you, you learn that it is 1 of 2 players.',
    reminderTokens: ['Demon', 'Wrong'],
  },

  // Sects and Violets - Outsiders
  mutant: {
    name: 'Mutant',
    description:
      'If you are “mad” about being an Outsider, you might be executed.',
  },
  sweetheart: {
    name: 'Sweetheart',
    description: 'When you die, 1 player is drunk from now on.',
    reminderTokens: ['Drunk'],
  },
  barber: {
    name: 'Barber',
    description:
      'If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.',
    reminderTokens: ['Can swap tonight'],
  },
  klutz: {
    name: 'Klutz',
    description:
      'When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.',
  },

  // Sects and Violets - Minions
  eviltwin: {
    name: 'Evil Twin',
    description:
      "You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live.",
    reminderTokens: ['Twin'],
  },
  witch: {
    name: 'Witch',
    description:
      'Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.',
    reminderTokens: ['Cursed'],
  },
  cerenovus: {
    name: 'Cerenovus',
    description:
      'Each night, choose a player & a good character: they are “mad” they are this character tomorrow, or might be executed.',
    reminderTokens: ['Mad'],
  },
  pithag: {
    name: 'Pit-Hag',
    description:
      'Each night*, choose a player & a character they become (if not in play). If a Demon is made, deaths tonight are arbitrary.',
  },

  // Sects and Violets - Demons
  fanggu: {
    name: 'Fang Gu',
    description:
      'Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]',
    reminderTokens: ['Killed by', 'Once'],
  },
  vigormortis: {
    name: 'Vigormortis',
    description:
      'Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor. [-1 Outsider]',
    reminderTokens: ['Killed by', 'Has ability', 'Poisoned'],
  },
  nodashii: {
    name: 'No Dashii',
    description:
      'Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned.',
    reminderTokens: ['Killed by', 'Poisoned'],
  },
  vortox: {
    name: 'Vortox',
    description:
      'Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.',
    reminderTokens: ['Killed by'],
  },

  // Sects and Violets - Travellers
  barista: {
    name: 'Barista',
    description:
      'Each night, until dusk, 1) a player becomes sober, healthy & gets true info, or 2) their ability works twice. They learn which.',
    reminderTokens: ['Sober & healthy', 'Ability works twice'],
  },
  harlot: {
    name: 'Harlot',
    description:
      'Each night*, choose a living player: if they agree, you learn their character, but you both might die.',
    reminderTokens: ['Killed by'],
  },
  butcher: {
    name: 'Butcher',
    description: 'Each day, after the 1st execution, you may nominate again.',
  },
  bonecollector: {
    name: 'Bone Collector',
    description:
      'Once per game, at night*, choose a dead player: they regain their ability until dusk.',
    reminderTokens: ['No ability', 'Has ability'],
  },
  deviant: {
    name: 'Deviant',
    description: 'If you were funny today, you cannot die by exile.',
    reminderTokens: ['Were funny'],
  },

  // Fall of Rome - Townsfolk
  sculptor: {
    name: 'Sculptor',
    description:
      'You start knowing a player. Each night*, you learn the alignment of their most recent nomination.',
    reminderTokens: ['Sculpture', 'Nominated'],
  },
  vestalvirgin: {
    name: 'Vestal Virgin',
    description:
      'You start knowing 1 good & 1 evil character, 1 of which is in-play. When they die, that night you learn 1 good & 1 evil character, 1 of which is in-play.',
    reminderTokens: ['Learns'],
  },
  physician: {
    name: 'Physician',
    description:
      'Each night, choose two players (not yourself): they are sober, healthy & get true info tonight. The 1st time the Demon kills one, you learn the Demon type.',
    reminderTokens: ['Patient', '1st Demon'],
  },
  legionary: {
    name: 'Legionary',
    description:
      'Each night, you learn how many living evil players are sat clockwise between yourself and the next living Legionary. [+0 to +2 Legionary]',
  },
  trumpeter: {
    name: 'Trumpeter',
    description:
      'Each night*, you learn how many evil players publicly claimed to be Spartacus today.',
    reminderTokens: ['Evil claim'],
  },
  mortician: {
    name: 'Mortician',
    description:
      'Each night*, if a player died by execution today you learn if either of their living neighbours are evil.',
    reminderTokens: ['Recently executed'],
  },
  standardbearer: {
    name: 'Standard Bearer',
    description:
      'When you are nominated, you may make a unique public statement about the nominator (not yourself). Tonight, you learn if the statement was true.',
    reminderTokens: ['True', 'False'],
  },
  centurion: {
    name: 'Centurion',
    description:
      'If you nominate & execute a living player, their team loses. You are safe from the Demon. If you publicly claimed to be Spartacus today, you are drunk until dawn.',
    reminderTokens: ['Drunk'],
  },
  merchant: {
    name: 'Merchant',
    description:
      'Once per game, at night*, choose to learn the characters of players that have nominated you.',
    reminderTokens: ['Nominated', 'No ability'],
  },
  gladiator: {
    name: 'Gladiator',
    description:
      'Once per game, during the day, publicly choose a living player. Tonight, you and they wake & silently play roshambo: whoever loses dies (someone must lose).',
    reminderTokens: ['Duel', 'Killed by', 'No ability'],
  },
  actor: {
    name: 'Actor',
    description:
      "Once per game, during the day, publicly guess 3 players' character types (not yourself, 1 guess per type). That night, you learn how many you got correct.",
    reminderTokens: ['Correct', 'Incorrect', 'No ability'],
  },
  blacksmith: {
    name: 'Blacksmith',
    description:
      'The 1st time the Demon kills you, you live & gain a not-in-play Townsfolk ability.',
    reminderTokens: ['Is the Blacksmith'],
  },
  scholar: {
    name: 'Scholar',
    description:
      'The 1st time you nominate a living Outsider, they immediately become a not-in-play Townsfolk. [+1 Outsider]',
    reminderTokens: ['Lectured', 'No ability'],
  },

  // Fall of Rome - Outsiders
  thetwins: {
    name: 'The Twins',
    description:
      'You start knowing a player: if either of you are executed, all Townsfolk are drunk until dusk tomorrow.',
    reminderTokens: ['Townsfolk drunk', 'Twin'],
  },
  winemaker: {
    name: 'Winemaker',
    description:
      'Your Townsfolk neighbours are drunk, but every other night, you are drunk until dusk, even if you are dead.',
    reminderTokens: ['Odd', 'Even'],
  },
  spartacus: {
    name: 'Spartacus',
    description:
      "If an evil player guesses you (once), your team loses. You might register as a Townsfolk; each day, if you did not publicly claim to be Spartacus, you don't.",
    reminderTokens: ['Guess used'],
  },
  badomen: {
    name: 'Bad Omen',
    description:
      'You do not know you are a Bad Omen. You think you are a Townsfolk, but you receive false information. You might register as evil, even if dead.',
    reminderTokens: ['Is the Bad Omen'],
  },

  // Fall of Rome - Minions
  temptress: {
    name: 'Temptress',
    description:
      'On your 1st night choose two players: they learn that they were chosen. The 1st time one of them dies by execution, the other becomes evil that night.',
    reminderTokens: ['Seduced'],
  },
  haruspex: {
    name: 'Haruspex',
    description:
      'Each night, choose a player: you learn their character. The 1st player you choose twice in this way, dies. [+Spartacus]',
    reminderTokens: ['Foretold', "Can't kill"],
  },
  glykon: {
    name: 'Glykon',
    description:
      'You might register as good. Until dawn, players you nominate register as the opposing alignment & if a Townsfolk, are also poisoned.',
    reminderTokens: ['Snake bite', 'Poisoned'],
  },
  augur: {
    name: 'Augur',
    description:
      'If a Townsfolk nominates you, they immediately become a Bad Omen.',
    reminderTokens: ['Is a Bad Omen'],
  },

  // Fall of Rome - Demons
  cleopatra: {
    name: 'Cleopatra',
    description:
      "Each night, choose two players: if they nominate tomorrow, they die that night. Each day, if a good player (Travellers don't count) does not nominate, evil wins.",
    reminderTokens: ['Chosen by', 'Killed by'],
  },
  crassus: {
    name: 'Crassus',
    description:
      'Each night*, choose a player: they die. If the 1st Crassus publicly claims to be Spartacus & dies with 5 or more players alive, an evil player becomes Crassus.',
    reminderTokens: ['1st Crassus', 'Killed by'],
  },
  hannibal: {
    name: 'Hannibal',
    description:
      'You think you are a good character, but you are not. Minions learn 3 bluffs. Each night*, a player might die. The 1st Hannibal to die, becomes good. [+1 Hannibal]',
    reminderTokens: ['Is Hannibal', 'Killed by'],
  },
  caesar: {
    name: 'Caesar',
    description:
      'Each night*, choose a player: they die. The 1st time an evil player dies by execution, that night, choose an additional player: they die.',
    reminderTokens: ['Betrayal', 'Kill used', 'Killed by'],
  },

  // Fall of Rome - Travellers
  mercenary: {
    name: 'Mercenary',
    description:
      'Each night*, gain the ability of a player who publicly claimed Spartacus today. If a Mercenary is exiled, you are exiled too. [+1 Mercenary of opposing alignment]',
  },
  architect: {
    name: 'Architect',
    description:
      'Each night*, choose a player: 1) they become a not-in-play character of the same type, or 2) they swap characters with a player of the same type.',
  },
  sibyl: {
    name: 'Sibyl',
    description:
      'Each day, after the 1st execution, you may publicly choose a dead player: they may nominate. If the majority of the dead and yourself agree, they are executed.',
  },
  highpriest: {
    name: 'High Priest',
    description:
      'Each day, publicly choose a unique living player to bless: if a majority of players agree, something good happens to them.',
  },
  highpriest2: {
    name: 'High Priest',
    description:
      'Each day, publicly choose a unique living player to bless: if a majority of players agree, tomorrow they may learn a statement. Tonight, choose if it’s true.',
  },
  emperor: {
    name: 'Emperor',
    description:
      "Each day, choose the 1st execution's outcome. If you choose to protect today's execution: they survive. Otherwise, tonight you learn their alignment.",
  },

  // Carousel - Townsfolk
  acrobat: {
    name: 'Acrobat',
    description:
      'Each night*, choose a player: if they are or become drunk or poisoned tonight, you die.',
  },
  alchemist: {
    name: 'Alchemist',
    description:
      'You have a Minion ability. When using this, the Storyteller may prompt you to choose differently.',
  },
  alsaahir: {
    name: 'Alsaahir',
    description:
      'Each day, if you publicly guess which players are Minion(s) and which are Demon(s), good wins.',
  },
  amnesiac: {
    name: 'Amnesiac',
    description:
      'You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are.',
  },
  atheist: {
    name: 'Atheist',
    description:
      'The Storyteller can break the game rules, and if executed, good wins, even if you are dead. [No evil characters]',
  },
  balloonist: {
    name: 'Balloonist',
    description:
      'Each night, you learn a player of a different character type than last night. [+0 or +1 Outsider]',
  },
  banshee: {
    name: 'Banshee',
    description:
      'If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination.',
  },
  bountyhunter: {
    name: 'Bounty Hunter',
    description:
      'You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]',
  },
  cannibal: {
    name: 'Cannibal',
    description:
      'You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution.',
  },
  choirboy: {
    name: 'Choirboy',
    description:
      'If the Demon kills the King, you learn which player is the Demon. [+the King]',
  },
  cultleader: {
    name: 'Cult Leader',
    description:
      'Each night, you become the alignment of an alive neighbor. If all good players choose to join your cult, your team wins.',
  },
  engineer: {
    name: 'Engineer',
    description:
      'Once per game, at night, choose which Minions or which Demon is in play.',
  },
  farmer: {
    name: 'Farmer',
    description:
      'When you die at night, an alive good player becomes a Farmer.',
  },
  fisherman: {
    name: 'Fisherman',
    description:
      'Once per game, during the day, visit the Storyteller for some advice to help your team win.',
  },
  general: {
    name: 'General',
    description:
      'Each night, you learn which alignment the Storyteller believes is winning: good, evil, or neither.',
  },
  highpriestess: {
    name: 'High Priestess',
    description:
      'Each night, learn which player the Storyteller believes you should talk to most.',
  },
  huntsman: {
    name: 'Huntsman',
    description:
      'Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]',
  },
  king: {
    name: 'King',
    description:
      'Each night, if the dead equal or outnumber the living, you learn 1 alive character. The Demon knows you are the King.',
  },
  knight: {
    name: 'Knight',
    description: 'You start knowing 2 players that are not the Demon.',
  },
  lycanthrope: {
    name: 'Lycanthrope',
    description:
      'Each night*, choose an alive player. If good, they die & the Demon doesn’t kill tonight. One good player registers as evil.',
  },
  magician: {
    name: 'Magician',
    description:
      'The Demon thinks you are a Minion. Minions think you are a Demon.',
  },
  nightwatchman: {
    name: 'Nightwatchman',
    description:
      'Once per game, at night, choose a player: they learn you are the Nightwatchman.',
  },
  noble: {
    name: 'Noble',
    description: 'You start knowing 3 players, 1 and only 1 of which is evil.',
  },
  pixie: {
    name: 'Pixie',
    description:
      'You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.',
  },
  poppygrower: {
    name: 'Poppygrower',
    description:
      'Minions & Demons do not know each other. If you die, they learn who each other are that night.',
  },
  princess: {
    name: 'Princess',
    description:
      "On your 1st day, if you nominated & executed a player, the Demon doesn't kill tonight.",
  },
  preacher: {
    name: 'Preacher',
    description:
      'Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability.',
  },
  shugenja: {
    name: 'Shugenja',
    description:
      'You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary.',
  },
  steward: {
    name: 'Steward',
    description: 'You start knowing 1 good player.',
  },
  villageidiot: {
    name: 'Village Idiot',
    description:
      'Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots. 1 of the extras is drunk]',
  },

  // Carousel - Outsiders
  damsel: {
    name: 'Damsel',
    description:
      'All Minions know a Damsel is in play. If a Minion publicly guesses you (once), your team loses.',
  },
  golem: {
    name: 'Golem',
    description:
      'You may only nominate once per game. When you do, if the nominee is not the Demon, they die.',
  },
  heretic: {
    name: 'Heretic',
    description:
      'Whoever wins, loses & whoever loses, wins, even if you are dead.',
  },
  hermit: {
    name: 'Hermit',
    description: 'You have all Outsider abilities. [-0 or -1 Outsider]',
  },
  hatter: {
    name: 'Hatter',
    description:
      'If you died today or tonight, the Minion & Demon players may choose new Minion & Demon characters to be.',
  },
  ogre: {
    name: 'Ogre',
    description:
      "On your 1st night, choose a player (not yourself): you become their alignment (you don't know which) even if drunk or poisoned.",
  },
  plaguedoctor: {
    name: 'Plague Doctor',
    description: 'When you die, the Storyteller gains a Minion ability.',
  },
  politician: {
    name: 'Politician',
    description:
      'If you were the player most responsible for your team losing, you change alignment & win, even if dead.',
  },
  puzzlemaster: {
    name: 'Puzzlemaster',
    description:
      '1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info.',
  },
  snitch: {
    name: 'Snitch',
    description: 'Each Minion gets 3 bluffs.',
  },
  zealot: {
    name: 'Zealot',
    description:
      'If there are 5 or more players alive, you must vote for every nomination.',
  },

  // Carousel - Minions
  boffin: {
    name: 'Boffin',
    description:
      'The Demon (even if drunk or poisoned) has a not-in-play good character’s ability. You both know which.',
  },
  boomdandy: {
    name: 'Boomdandy',
    description:
      'If you are executed, all but 3 players die. After a 10 to 1 countdown, the player with the most players pointing at them, dies.',
  },
  fearmonger: {
    name: 'Fearmonger',
    description:
      'Each night, choose a player: if you nominate & execute them, their team loses. All players know if you choose a new player.',
  },
  goblin: {
    name: 'Goblin',
    description:
      'If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.',
  },
  harpy: {
    name: 'Harpy',
    description:
      'Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or one or both might die.',
  },
  marionette: {
    name: 'Marionette',
    description:
      'You think you are a good character, but you are not. The Demon knows who you are. [You neighbor the Demon]',
  },
  mezepheles: {
    name: 'Mezepheles',
    description:
      'You start knowing a secret word. The 1st good player to say this word becomes evil that night.',
  },
  organgrinder: {
    name: 'Organ Grinder',
    description:
      'All players keep their eyes closed when voting and the vote tally is secret. Each night, choose if you are drunk until dusk.',
  },
  summoner: {
    name: 'Summoner',
    description:
      'You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]',
  },
  psychopath: {
    name: 'Psychopath',
    description:
      'Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo.',
  },
  vizier: {
    name: 'Vizier',
    description:
      'All players know you are the Vizier. You cannot die during the day. If good voted, you may choose to execute immediately.',
  },
  widow: {
    name: 'Widow',
    description:
      'On your 1st night, look at the Grimoire & choose a player: they are poisoned. 1 good player knows a Widow is in play.',
  },
  wizard: {
    name: 'Wizard',
    description:
      'Once per game, choose to make a wish. If granted, it might have a price & leave a clue as to its nature.',
  },
  xaan: {
    name: 'Xaan',
    description:
      'On night X, all Townsfolk are poisoned until dusk. [X Outsiders]',
  },
  wraith: {
    name: 'Wraith',
    description:
      'You may choose to open your eyes at night. You wake when other evil players do.',
  },

  // Carousel - Demons
  riot: {
    name: 'Riot',
    description:
      'On day 3, Minions become Riot & nominees die but nominate an alive player immediately. This must happen.',
  },
  alhadikhia: {
    name: 'Al-Hadikhia',
    description:
      'Each night*, you may choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die.',
  },
  kazali: {
    name: 'Kazali',
    description:
      'Each night*, choose a player: they die. [You choose which players are which Minions. -? to +? Outsiders]',
  },
  legion: {
    name: 'Legion',
    description:
      'Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]',
  },
  leviathan: {
    name: 'Leviathan',
    description:
      'If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins.',
  },
  lilmonsta: {
    name: "Lil'Monsta",
    description: `Each night, Minions choose who babysits Lil' Monsta & "is the Demon". Each night*, a player might die. [+1 Minion]`,
  },
  lleech: {
    name: 'Lleech',
    description:
      'Each night*, choose a player: they die. You start by choosing a player: they are poisoned. You die if & only if they are dead.',
  },
  lordoftyphon: {
    name: 'Lord of Typhon',
    description:
      'Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. -? to +? Outsiders]',
  },
  ojo: {
    name: 'Ojo',
    description:
      'Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies.',
  },
  yaggababble: {
    name: 'Yaggababble',
    description:
      'You start knowing a secret phrase. For each time you said it publicly today, a player might die.',
  },

  // Carousel - Travellers
  gangster: {
    name: 'Gangster',
    description:
      'Once per day, you may choose to kill an alive neighbor, if your other alive neighbor agrees.',
  },
  gnome: {
    name: 'Gnome',
    description:
      'All players start knowing a player of your alignment. You may choose to kill anyone who nominates them.',
  },
} as const;

export type CharacterId = keyof typeof _characters;

export const CHARACTERS = Object.entries(_characters).reduce(
  (acc, [id, val]) => {
    acc[id as CharacterId] = { ...val, id: id as CharacterId };
    return acc;
  },
  {} as Record<CharacterId, BotcCharacter>,
);

export interface Reminder {
  characterId: CharacterId;
  message: string;
}

type NightAbilityTarget = number | CharacterId; // If number, target is the index of a player in the player list. If CharacterId, target is that character (e.g. Courtier)
type NightAbilityTargetFilter = 'neighbour' | 'alive' | 'dead';
interface NightAbilityTargetType {
  baseType: 'player' | 'character';
  filters: NightAbilityTargetFilter[];
}

interface NightAbility {
  targetType: NightAbilityTargetType;
  abilityFunction: (
    players: BotcPlayer[],
    targets?: NightAbilityTarget[],
  ) => BotcPlayer[];
}

interface NightOrderAbility {
  id: CharacterId;
  description: string;
  ability?: NightAbility;
}

export const FIRST_NIGHT_TEXT: NightOrderAbility[] = [
  {
    id: 'wraith',
    description: 'Wake the Wraith whenever other evil players wake.',
  },
  {
    id: 'hannibal',
    description:
      "During Minion information, when showing the Demon point to the players who have the 'Is Hannibal' token next to their characters and show the Hannibal token. Show the other Minions as normal. Show the minions three not-in-play characters.",
  },
  {
    id: 'lordoftyphon',
    description:
      "Wake the players on either side of the Demon. Show them the 'You Are' card, the token of the Minion they now are, and a thumbs down to indicate they are evil.",
  },
  {
    id: 'kazali',
    description:
      'The Kazali points at a player and a Minion on the character sheet. Replace their old character token with the Minion token, show them the “You Are” info token then the Minion character token, and give a thumbs down. Repeat until the normal number of Minions exist. Put the Kazali to sleep.',
  },
  {
    id: 'boffin',
    description:
      'Wake the Boffin and how them the token of the ability the Demon has. Put the Boffin back to sleep. Wake the Demon, show the Boffin token, then show the token of the good ability the Demon has.',
  },
  {
    id: 'philosopher',
    description:
      "The Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token. Or, if the character is in play, place the drunk marker by that player and the Not the Philosopher token by the Philosopher.",
  },
  {
    id: 'alchemist',
    description: 'Show the Alchemist a not-in-play Minion token.',
  },
  {
    id: 'poppygrower',
    description: 'Do not inform the Demon/Minions who each other are.',
  },
  {
    id: 'yaggababble',
    description: 'Show the Yaggababble their secret phrase.',
  },
  {
    id: 'temptress',
    description:
      "Wake the Temptress and ask them to choose two players. Place the 'Seduced' reminder token next to the two players. Wake the two players separately showing the 'This character selected you' card, then the Temptress token.",
  },
  {
    id: 'crassus',
    description: "Place the '1st Crassus' reminder token next to Crassus.",
  },
  {
    id: 'snitch',
    description:
      'After Minion info wake each Minion and show them three not-in-play character tokens. These may be the same or different to each other and the ones shown to the Demon.',
  },
  {
    id: 'lunatic',
    description:
      "If 7 or more players: Show the Lunatic a number of arbitrary 'Minions', players equal to the number of Minions in play. Show 3 character tokens of arbitrary good characters. If the token received by the Lunatic is a Demon that would wake tonight: Allow the Lunatic to do the Demon actions. Place their 'attack' markers. Wake the Demon. Show the Demon's real character token. Show them the Lunatic player. If the Lunatic attacked players: Show the real demon each marked player. Remove any Lunatic 'attack' markers.",
  },
  {
    id: 'summoner',
    description:
      "Show the 'These characters are not in play' card. Show 3 character tokens of good characters not in play.",
  },
  {
    id: 'king',
    description:
      "Wake the Demon, show them the 'This character selected you' card, show the King token and point to the King player.",
  },
  {
    id: 'sailor',
    description:
      'The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.',
  },
  {
    id: 'marionette',
    description:
      'Select one of the good players next to the Demon and place the Is the Marionette reminder token. Wake the Demon and show them the Marionette.',
  },
  {
    id: 'engineer',
    description:
      "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the You are card and the relevant character tokens.",
  },
  {
    id: 'preacher',
    description:
      "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
  },
  {
    id: 'lilmonsta',
    description:
      "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta.",
  },
  {
    id: 'lleech',
    description:
      'The Lleech points to a player. Place the Poisoned reminder token.',
  },
  {
    id: 'xaan',
    description:
      'If the X token is placed in the Grimoire, all Townsfolk are poisoned.',
  },
  {
    id: 'poisoner',
    description: 'The Poisoner points to a player. That player is poisoned.',
  },
  {
    id: 'widow',
    description:
      "Show the Grimoire to the Widow for as long as they need. The Widow points to a player. That player is poisoned. Wake a good player. Show the 'These characters are in play' card, then the Widow character token.",
  },
  {
    id: 'courtier',
    description:
      "The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
  },
  { id: 'wizard', description: 'Run the Wizard ability if applicable.' },
  {
    id: 'snakecharmer',
    description:
      'The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.',
  },
  { id: 'godfather', description: 'Show each of the Outsider tokens in play.' },
  {
    id: 'organgrinder',
    description:
      'The Organ Grinder either nods or shakes their head. If they nod their head, mark them with the DRUNK reminder. Put the Organ Grinder to sleep.',
  },
  {
    id: 'devilsadvocate',
    description:
      "The Devil's Advocate points to a living player. That player survives execution tomorrow.",
  },
  {
    id: 'eviltwin',
    description:
      'Wake the Evil Twin and their twin. Confirm that they have acknowledged each other. Point to the Evil Twin. Show their Evil Twin token to the twin player. Point to the twin. Show their character token to the Evil Twin player.',
  },
  {
    id: 'witch',
    description:
      'The Witch points to a player. If that player nominates tomorrow they die immediately.',
  },
  {
    id: 'cerenovus',
    description:
      "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
  },
  {
    id: 'fearmonger',
    description:
      'The Fearmonger points to a player. Place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.',
  },
  {
    id: 'harpy',
    description:
      "Wake the Harpy; they point at one player, then another. Wake the 1st player the Harpy pointed to, show them the 'This character has selected you' card, show them the Harpy token, then point at the 2nd player the Harpy pointed to.",
  },
  { id: 'mezepheles', description: 'Show the Mezepheles their secret word.' },
  {
    id: 'pukka',
    description: 'The Pukka points to a player. That player is poisoned.',
  },
  {
    id: 'cleopatra',
    description:
      "Wake Cleopatra and ask them to choose two players. Place the 'Chosen by' reminder token next to the two players.",
  },
  {
    id: 'haruspex',
    description:
      "Wake the Haruspex and ask them to choose a player. Place the 'Foretold' reminder token next to the chosen player and show the Haruspex the chosen player's character. If the chosen player already has a 'Foretold' reminder token, show the Haruspex that player's character, then swap the existing 'Foretold' reminder token with the 'Killed by' reminder token, the chosen player dies, then place the 'Can't kill' reminder token next to the Haruspex.",
  },
  {
    id: 'winemaker',
    description:
      "Place the 'Odd' or 'Even' reminder token next to the Winemaker. If an 'Odd' reminder token, the Winemaker is drunk on all of the odd nights (first, third, fifth...). If an 'Even' reminder token, the Winemaker is drunk on all of the even nights (second, fourth, sixth...). If reminder token is 'Odd', the Winemaker is drunk. Otherwise, their Townfolk neighbours are drunk (first night counts as night 1).",
  },
  {
    id: 'thetwins',
    description:
      "Wake The Twins, and point to a player. Place the 'Twin' reminder token next to that player (Note that all references to 'The Twins' are to the Outsider character itself, i.e. 'Wake The Twins' means wake the player playing as The Twins).",
  },
  {
    id: 'physician',
    description:
      "Wake the Physician and ask them to choose two players. Place the 'Patient' reminder token next to the two players.",
  },
  {
    id: 'sculptor',
    description:
      "Wake the Sculptor and point to a player. Place the 'Sculpture' reminder token next to the shown player. The shown player can be of any alignment.",
  },
  {
    id: 'vestalvirgin',
    description:
      "Wake the Vestal Virgin and show them one good character and one evil character, one of which is in play. Place the 'Learns' reminder token next to the player with the in-play character.",
  },
  {
    id: 'legionary',
    description:
      'Wake the Legionaries separately. They learn the number of evil players sitting clockwise between them and the next living Legionary. If they are the only Legionary, they learn clockwise to themselves. If a Legionary dies and there are other Legionaries alive, you still wake the living Legionaries. ',
  },
  {
    id: 'pixie',
    description: 'Show the Pixie 1 in-play Townsfolk character token.',
  },
  {
    id: 'huntsman',
    description:
      "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
  },
  {
    id: 'damsel',
    description:
      "Wake all the Minions, show them the 'This character selected you' card and the Damsel token.",
  },
  {
    id: 'amnesiac',
    description:
      "Decide the Amnesiac's entire ability. If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
  },
  {
    id: 'washerwoman',
    description:
      'Show the character token of a Townsfolk in play. Point to two players, one of which is that character.',
  },
  {
    id: 'librarian',
    description:
      'Show the character token of an Outsider in play. Point to two players, one of which is that character.',
  },
  {
    id: 'investigator',
    description:
      'Show the character token of a Minion in play. Point to two players, one of which is that character.',
  },
  {
    id: 'chef',
    description:
      'Show the finger signal (0, 1, 2, …) for the number of pairs of neighbouring evil players.',
  },
  {
    id: 'empath',
    description:
      'Show the finger signal (0, 1, 2) for the number of evil alive neighbours of the Empath.',
  },
  {
    id: 'fortuneteller',
    description:
      'The Fortune Teller points to two players. Give the head signal (nod yes, shake no) for whether one of those players is the Demon.',
  },
  {
    id: 'butler',
    description: "The Butler points to a player. Mark that player as 'Master'.",
  },
  {
    id: 'grandmother',
    description: 'Show the marked character token. Point to the marked player.',
  },
  {
    id: 'clockmaker',
    description:
      'Show the hand signal for the number (1, 2, 3, etc.) of places from Demon to closest Minion.',
  },
  {
    id: 'dreamer',
    description:
      'The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.',
  },
  {
    id: 'seamstress',
    description:
      "The Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
  },
  { id: 'steward', description: 'Point to 1 good player.' },
  { id: 'knight', description: 'Point to 2 non-Demon players.' },
  {
    id: 'noble',
    description:
      'Point to 3 players including one evil player, in no particular order.',
  },
  {
    id: 'balloonist',
    description:
      "Choose a character type. Point to a player whose character is of that type. Place the Balloonist's Seen reminder next to that character.",
  },
  {
    id: 'shugenja',
    description:
      'Wake the Shugenja; point horizontally in the direction of the closest evil player. If the two closest evil players are equidistant, point your finger horizontally in either direction.',
  },
  {
    id: 'villageidiot',
    description:
      'The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil.',
  },
  {
    id: 'bountyhunter',
    description:
      "Point to 1 evil player. Wake the townsfolk who is evil and show them the 'You are' card and the thumbs down evil sign.",
  },
  {
    id: 'nightwatchman',
    description:
      "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
  },
  {
    id: 'cultleader',
    description:
      'If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.',
  },
  {
    id: 'spy',
    description: 'Show the Grimoire to the Spy for as long as they need.',
  },
  {
    id: 'ogre',
    description:
      'The Ogre points to a player (not themselves) and becomes their alignment.',
  },
  { id: 'highpriestess', description: 'Point to a player.' },
  {
    id: 'general',
    description:
      'Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.',
  },
  {
    id: 'chambermaid',
    description:
      'The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.',
  },
  {
    id: 'mathematician',
    description:
      'Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.',
  },
  {
    id: 'leviathan',
    description:
      "Place the Leviathan 'Day 1' marker. Announce 'The Leviathan is in play; this is Day 1.'",
  },
  {
    id: 'vizier',
    description:
      "Announce 'The Vizier is in play' and state which player they are.",
  },
] as const;

export const OTHER_NIGHTS_TEXT: NightOrderAbility[] = [
  {
    id: 'wraith',
    description: 'Wake the Wraith whenever other evil players wake.',
  },
  {
    id: 'philosopher',
    description:
      "If the Philosopher has not used their ability: the Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token. Or, if the character is in play, place the drunk marker by that player and the Not the Philosopher token by the Philosopher.",
  },
  {
    id: 'poppygrower',
    description:
      'If the Poppy Grower has died, show the Minions/Demon who each other are.',
  },
  {
    id: 'sailor',
    description:
      'The previously drunk player is no longer drunk. The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.',
  },
  {
    id: 'scholar',
    description:
      "If the Scholar nominated a living Outsider and converted them today, wake the nominated player and show them the 'You are' card, then show them their Townsfolk character token. Place the 'Lectured' reminder token next to the nominated player, and the 'No ability' reminder token next to the Scholar.",
  },
  {
    id: 'temptress',
    description:
      "If a player with the 'Seduced' reminder token was executed today and died, remove their 'Seduced' reminder token. That night, wake the player with the remaining 'Seduced' reminder token. Show them the 'You are' card and then the thumbs down evil signal. They are now evil. Remove their 'Seduced' reminder token and replace it with the 'Evil' reminder token.",
  },
  {
    id: 'mercenary',
    description:
      "Place the 'Good ability' reminder token next to a player with an I AM SPARTACUS! Fabled reminder token. Wake the good Mercenary and show them the character token of the player with the 'Good ability' reminder token; the good Mercenary has that ability until they receive a new ability during the following night. Complete the same process for the evil Mercenary, this time using the 'Evil ability' reminder token.",
  },
  {
    id: 'highpriest',
    description:
      "Have something good happen to the player with the 'Blessed' reminder token.",
  },
  {
    id: 'highpriest2',
    description:
      'do whatever i dont fukcing understand this character. almanac says nothing',
  },
  {
    id: 'architect',
    description:
      "Wake the Architect and ask them to choose a player. Place the REDESIGNED reminder token next to that player. Place an additional REDESIGNED reminder token next to a player of the same character type, or choose not to;\n\nIf only 1 REDESIGNED reminder token is on the grimoire, replace the character token of that player with a not-in-play character of the same type. Wake the player and show them the 'You are' card, then shown them their new character token.\n\nIf 2 REDESIGNED reminder tokens are on the grimoire, swap the character tokens of those two players. Wake each player separately and show them the 'You are' card, then shown them their new character token.",
  },
  {
    id: 'emperor',
    description:
      "If the Emperor went through with todays execution, wake the Emperor, they learn the executed player's alignment. If good, tell them 'good' (thumbs up) otherwise tell them 'evil (thumbs down).",
  },
  {
    id: 'winemaker',
    description:
      "On odd nights, if the 'Even' reminder token is next to the Winemaker place the 'Drunk' reminder token next to the Winemaker's Townsfolk neighbours. Otherwise: remove all 'Drunk' reminder tokens.\n\nOn even nights, if the 'Odd' reminder token is next to the Winemaker place the 'Drunk' reminder token next to the Winemaker's Townsfolk neighbours. Otherwise: remove all 'Drunk' reminder tokens.",
  },
  {
    id: 'thetwins',
    description:
      "If a player with the 'Twin' reminder token or The Twins was executed today, place the 'Townsfolk drunk' reminder token next to The Twins.",
  },
  {
    id: 'physician',
    description:
      "Remove all 'Patient' reminder tokens. Wake the Physician and ask them to choose two players. Place the 'Patient' reminder token next to the two players.\n\nIf a player with a 'Patient' reminder token is killed by the Demon, place the '1st Demon' reminder token next to the Physician. If the '1st Demon' reminder token is already next to the Physician, do not wake the Physician. Otherwise wake the Physician and show them the Demon token.",
  },
  {
    id: 'engineer',
    description:
      "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the 'You are' card and the relevant character tokens.",
  },
  {
    id: 'preacher',
    description:
      "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
  },
  {
    id: 'xaan',
    description:
      'If the X token is placed in the Grimoire, all Townsfolk are poisoned.',
  },
  {
    id: 'poisoner',
    description:
      'The previously poisoned player is no longer poisoned. The Poisoner points to a player. That player is poisoned.',
  },
  {
    id: 'courtier',
    description:
      "Reduce the remaining number of days the marked player is poisoned. If the Courtier has not yet used their ability: The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
  },
  {
    id: 'innkeeper',
    description:
      'The previously protected and drunk players lose those markers. The Innkeeper points to two players. Those players are protected. One is drunk.',
  },
  { id: 'wizard', description: 'Run the Wizard ability if applicable.' },
  {
    id: 'gambler',
    description:
      'The Gambler points to a player, and a character on their sheet. If incorrect, the Gambler dies.',
  },
  {
    id: 'acrobat',
    description:
      'The Acrobat chooses a player. If they become drunk or are poisoned tonight, the Acrobat player dies.',
  },
  {
    id: 'snakecharmer',
    description:
      'The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.',
  },
  {
    id: 'monk',
    description:
      "The previously protected player is no longer protected. The Monk points to a player not themself. Mark that player 'Protected'.",
  },
  {
    id: 'organgrinder',
    description:
      'The Organ Grinder either nods or shakes their head. If they nod their head, mark them with the DRUNK reminder. Put the Organ Grinder to sleep.',
  },
  {
    id: 'devilsadvocate',
    description:
      "The Devil's Advocate points to a living player, different from the previous night. That player survives execution tomorrow.",
  },
  {
    id: 'witch',
    description:
      'If there are 4 or more players alive: The Witch points to a player. If that player nominates tomorrow they die immediately.',
  },
  {
    id: 'cerenovus',
    description:
      "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
  },
  {
    id: 'pithag',
    description:
      "The Pit-Hag points to a player and a character on the sheet. If this character is not in play, wake that player and show them the 'You are' card and the relevant character token. If the character is in play, nothing happens.",
  },
  {
    id: 'fearmonger',
    description:
      'The Fearmonger points to a player. If different from the previous night, place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.',
  },
  {
    id: 'harpy',
    description:
      "Wake the Harpy; they point at one player, then another. Wake the 1st player the Harpy pointed to, show them the 'This character has selected you' card, show them the Harpy token, then point at the 2nd player the Harpy pointed to.",
  },
  {
    id: 'mezepheles',
    description:
      "Wake the 1st good player that said the Mezepheles' secret word and show them the 'You are' card and the thumbs down evil signal.",
  },
  {
    id: 'scarletwoman',
    description:
      "If the Scarlet Woman became the Demon today: Show the 'You are' card, then the demon token.",
  },
  {
    id: 'summoner',
    description:
      'If it is the 3rd night, wake the Summoner. They point to a player and a Demon on the character sheet - that player becomes that Demon.',
  },
  {
    id: 'lunatic',
    description:
      "Allow the Lunatic to do the actions of the Demon. Place their 'attack' markers. If the Lunatic selected players: Wake the Demon. Show the 'attack' marker, then point to each marked player. Remove any Lunatic 'attack' markers.",
  },
  {
    id: 'exorcist',
    description:
      'The Exorcist points to a player, different from the previous night. If that player is the Demon: Wake the Demon. Show the Exorcist token. Point to the Exorcist. The Demon does not act tonight.',
  },
  {
    id: 'lycanthrope',
    description:
      'The Lycanthrope points to a living player: if good, they die and no one else can die tonight.',
  },
  {
    id: 'princess',
    description:
      "If it was the Princess' first day today, and they nominated and executed a player, the Demon doesn't kill.",
  },
  { id: 'legion', description: 'Choose a player, that player dies.' },
  {
    id: 'imp',
    description:
      "The Imp points to a player. That player dies. If the Imp chose themselves: Replace the character of 1 alive minion with a spare Imp token. Show the 'You are' card, then the Imp token.",
  },
  {
    id: 'zombuul',
    description:
      'If no-one died during the day: The Zombuul points to a player. That player dies.',
  },
  {
    id: 'pukka',
    description:
      'The Pukka points to a player. That player is poisoned. The previously poisoned player dies.',
  },
  {
    id: 'shabaloth',
    description:
      'One player that the Shabaloth chose the previous night might be resurrected. The Shabaloth points to two players. Those players die.',
  },
  {
    id: 'po',
    description:
      "If the Po chose no-one the previous night: The Po points to three players. Otherwise: The Po either shows the 'no' head signal , or points to a player. Chosen players die",
  },
  {
    id: 'fanggu',
    description:
      "The Fang Gu points to a player. That player dies. Or, if that player was an Outsider and there are no other Fang Gu in play: The Fang Gu dies instead of the chosen player. The chosen player is now an evil Fang Gu. Wake the new Fang Gu. Show the 'You are' card, then the Fang Gu token. Show the 'You are' card, then the thumb-down 'evil' hand sign.",
  },
  {
    id: 'nodashii',
    description: 'The No Dashii points to a player. That player dies.',
  },
  {
    id: 'vortox',
    description: 'The Vortox points to a player. That player dies.',
  },
  {
    id: 'lordoftyphon',
    description: 'The Lord of Typhon points to a player. That player dies.',
  },
  {
    id: 'vigormortis',
    description:
      'The Vigormortis points to a player. That player dies. If a Minion, they keep their ability and one of their Townsfolk neighbours is poisoned.',
  },
  {
    id: 'ojo',
    description:
      'The Ojo points to a character on the sheet; if in play, that player dies. If it is not in play, the Storyteller chooses who dies instead.',
  },
  {
    id: 'alhadikhia',
    description:
      'The Al-Hadikhia chooses 3 players. Announce the first player, wake them to nod yes to live or shake head no to die, kill or resurrect accordingly, then put to sleep and announce the next player. If all 3 are alive after this, all 3 die.',
  },
  {
    id: 'lleech',
    description: 'The Lleech points to a player. That player dies.',
  },
  {
    id: 'lilmonsta',
    description:
      "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta. Choose a player, that player dies.",
  },
  {
    id: 'yaggababble',
    description:
      'Choose a number of players up to the total number of times the Yaggababble said their secret phrase publicly, those players die.',
  },
  {
    id: 'kazali',
    description: 'The Kazali points to a player. That player dies.',
  },
  {
    id: 'cleopatra',
    description:
      "If no good players (excluding players that register as evil) nominated today, the game ends and evil wins.\n\nIf a player marked with the 'Chosen' reminder token nominated today, mark them with the 'Killed by' reminder token. They die. Otherwise, remove their 'Chosen' reminder token.  Wake Cleopatra and ask them to choose two players. Place the 'Chosen' reminder token next to the two players.",
  },
  {
    id: 'crassus',
    description:
      "On Crassus' first night place the '1st Crassus' reminder token next to Crassus. If the '1st Crassus' reminder token is already on the grimoire, do not move it.\n\nWake Crassus and ask them to choose a player. Mark the chosen player with the 'Killed by' reminder token. They die.",
  },
  {
    id: 'hannibal',
    description:
      "A player might die for each living Hannibal. Place the 'Killed by' reminder token(s) next to the chosen player(s). They die.",
  },
  {
    id: 'caesar',
    description:
      "If there is no 'Kill used' reminder token next to Caesar and an evil player died by execution today, ask Caesar to choose two players. Mark the chosen players with the 'Killed by' reminder tokens. They die. Place the 'Kill used' reminder token next to Caesar.\n\nOtherwise, ask Caesar to choose a player. Mark the chosen player with the 'Killed by' reminder token. They die.",
  },
  {
    id: 'assassin',
    description:
      "If the Assassin has not yet used their ability: The Assassin either shows the 'no' head signal, or points to a player. That player dies.",
  },
  {
    id: 'godfather',
    description:
      'If an Outsider died today: The Godfather points to a player. That player dies.',
  },
  {
    id: 'haruspex',
    description:
      "Wake the Haruspex and ask them to choose a player. Place the 'Foretold' reminder token next to the chosen player and show the Haruspex the chosen player's character. If the chosen player already has a 'Foretold' reminder token, show the Haruspex that player's character, then swap the existing 'Foretold' reminder token with the 'Killed by' reminder token, the chosen player dies, then place the 'Can't kill' reminder token next to the Haruspex.",
  },
  {
    id: 'blacksmith',
    description:
      "If the Blacksmith is targeted by the Demon for the first time, and would normally die, instead place the 'Is the Blacksmith' reminder token next to the Blacksmith. Replace the Blacksmith character token with a not-in-play Townsfolk character token. Wake the Blacksmith and show them the 'You are' card, then show them their not-in-play Townsfolk character ability.",
  },
  {
    id: 'gossip',
    description:
      "If the Gossip's public statement was true: Choose a player not protected from dying tonight. That player dies.",
  },
  {
    id: 'gladiator',
    description:
      "If a player has the 'Duel' token next to them wake both that player and the Gladiator at the same time. Have both players silently play roshambo, each choosing rock, paper or scissors. If both players choose the same, have them play again until someone wins. Place the 'Killed by' reminder token next to the player that lost, they die. Place the 'No ability' token next to the Gladiator.",
  },
  {
    id: 'sculptor',
    description:
      "If a player has the 'Nominated' reminder token next to them, wake the Sculptor. The Sculptor learns the current alignment of the player with the 'Nominated' token next to them. If no players have the 'Nominated' token next to them, the Sculptor is not woken and does not learn anything at night.",
  },
  {
    id: 'vestalvirgin',
    description:
      "If the player with the 'Learns' reminder token is dead, wake the Vestal Virgin and show them one good and one evil character, one of which is in play. If the in-play character is alive, do not wake the Vestal Virgin.",
  },
  {
    id: 'legionary',
    description:
      'Wake the Legionaries separately. They learn the number of evil players sitting clockwise between them and the next living Legionary. If they are the only Legionary, they learn clockwise to themselves. If a Legionary dies and there are other Legionaries alive, you still wake the living Legionaries. ',
  },
  {
    id: 'trumpeter',
    description:
      'Wake the Trumpeter. They learn how many evil players publicly claimed to be Spartacus today (keep misregistrations in mind).',
  },
  {
    id: 'mortician',
    description:
      "If a player was executed today, wake the Mortician. They learn if either of the player's current living neighbours are evil. If one or both of the living neighbours are evil tell the Mortician 'yes', otherwise tell the player 'no'. If multiple people were executed (e.g. via Sibyl), do the former for both players and clarify which by first pointing to the associated player.",
  },
  {
    id: 'standardbearer',
    description:
      "If the Standard Bearer has a 'True' or 'False' reminder token next to them, wake the Standard Bearer. They learn which token is next to them 'true' or 'false'. Remove any 'True' or 'False' reminder tokens, if any.",
  },
  {
    id: 'actor',
    description:
      "If the Actor made their public guess today, wake them. The Actor learns the number equal to the number of 'Correct' reminder tokens on the grimoire, then place the 'No ability' reminder token.",
  },
  {
    id: 'merchant',
    description:
      "If the Merchant hasn't used their ability, wake and ask them if they would like to use their ability. If yes, show the character tokens of any players with the 'Nominated' reminder tokens.",
  },
  {
    id: 'hatter',
    description:
      "If the Hatter died today: Wake the Minions and Demon. Show them the 'This Character Selected You' info token, then the Hatter token. Each player either shakes their head no or points to another character of the same type as their current character. If a second player would end up with the same character as another player, shake your head no and gesture for them to choose again. Put them to sleep. Change each player to the character they chose.",
  },
  {
    id: 'barber',
    description:
      "If the Barber died today: Wake the Demon. Show the 'This character selected you' card, then Barber token. The Demon either shows a 'no' head signal, or points to 2 players. If they chose players: Swap the character tokens. Wake each player. Show 'You are', then their new character token.",
  },
  { id: 'sweetheart', description: 'Choose a player that is drunk.' },
  {
    id: 'sage',
    description:
      'If the Sage was killed by a Demon: Point to two players, one of which is that Demon.',
  },
  { id: 'banshee', description: 'Announce that the Banshee has died.' },
  {
    id: 'professor',
    description:
      'If the Professor has not used their ability: The Professor either shakes their head no, or points to a player. If that player is a Townsfolk, they are now alive.',
  },
  {
    id: 'choirboy',
    description:
      'If the King was killed by the Demon, wake the Choirboy and point to the Demon player.',
  },
  {
    id: 'huntsman',
    description:
      "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
  },
  {
    id: 'damsel',
    description:
      "If selected by the Huntsman, wake the Damsel, show 'You are' card and a not-in-play Townsfolk token.",
  },
  {
    id: 'amnesiac',
    description:
      "If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
  },
  {
    id: 'farmer',
    description:
      "If a Farmer died tonight, choose another good player and make them the Farmer. Wake this player, show them the 'You are' card and the Farmer character token.",
  },
  { id: 'tinker', description: 'The Tinker might die.' },
  {
    id: 'moonchild',
    description:
      'If the Moonchild used their ability to target a player today: If that player is good, they die.',
  },
  {
    id: 'grandmother',
    description:
      "If the Grandmother's grandchild was killed by the Demon tonight: The Grandmother dies.",
  },
  {
    id: 'ravenkeeper',
    description:
      "If the Ravenkeeper died tonight: The Ravenkeeper points to a player. Show that player's character token.",
  },
  {
    id: 'empath',
    description:
      'Show the finger signal (0, 1, 2) for the number of evil neighbours.',
  },
  {
    id: 'fortuneteller',
    description:
      "The Fortune Teller points to two players. Show the head signal (nod 'yes', shake 'no') for whether one of those players is the Demon.",
  },
  {
    id: 'undertaker',
    description:
      "If a player was executed today: Show that player's character token.",
  },
  {
    id: 'dreamer',
    description:
      'The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.',
  },
  {
    id: 'flowergirl',
    description:
      "Nod 'yes' or shake head 'no' for whether the Demon voted today. Place the 'Demon not voted' marker (remove 'Demon voted', if any).",
  },
  {
    id: 'towncrier',
    description:
      "Nod 'yes' or shake head 'no' for whether a Minion nominated today. Place the 'Minion not nominated' marker (remove 'Minion nominated', if any).",
  },
  {
    id: 'oracle',
    description:
      'Show the hand signal for the number (0, 1, 2, etc.) of dead evil players.',
  },
  {
    id: 'seamstress',
    description:
      "If the Seamstress has not yet used their ability: the Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
  },
  {
    id: 'juggler',
    description:
      "If today was the Juggler's first day: Show the hand signal for the number (0, 1, 2, etc.) of 'Correct' markers. Remove markers.",
  },
  {
    id: 'balloonist',
    description:
      "Choose a character type that does not yet have a Seen reminder next to a character of that type. Point to a player whose character is of that type, if there are any. Place the Balloonist's Seen reminder next to that character.",
  },
  {
    id: 'villageidiot',
    description:
      'The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil.',
  },
  {
    id: 'king',
    description:
      'If there are more dead than living, show the King a character token of a living player.',
  },
  {
    id: 'bountyhunter',
    description:
      'If the known evil player has died, point to another evil player.',
  },
  {
    id: 'nightwatchman',
    description:
      "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
  },
  {
    id: 'cultleader',
    description:
      'If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.',
  },
  {
    id: 'butler',
    description: "The Butler points to a player. Mark that player as 'Master'.",
  },
  {
    id: 'spy',
    description: 'Show the Grimoire to the Spy for as long as they need.',
  },
  { id: 'highpriestess', description: 'Point to a player.' },
  {
    id: 'general',
    description:
      'Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.',
  },
  {
    id: 'chambermaid',
    description:
      'The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.',
  },
  {
    id: 'mathematician',
    description:
      'Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.',
  },
  {
    id: 'leviathan',
    description: 'Change the Leviathan Day reminder for the next day.',
  },
] as const;
