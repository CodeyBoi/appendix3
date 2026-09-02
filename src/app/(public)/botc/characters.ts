import { BotcPlayer, BotcPlayers } from './blood-on-the-clocktower-game';

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
  id: string;
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
    id: 'muppets-on-a-clocktower',
    name: 'Muppets on a Clocktower',
    townsfolk: [
      'bunsenhoneydew',
      'rowlfthedog',
      'pepetheprawn',
      'samtheeagle',
      'kermitthefrog',
      'camillathechicken',
      'sweetums',
      'swedishchef',
      'thegreatgonzo',
      'rizzotherat',
      'fozziebear',
      'beaker',
      'drteeth',
    ],
    outsiders: ['longjohnsilver', 'scrooge', 'cameraman', 'human'],
    minions: ['crazyharry', 'animal', 'constantine', 'scooter'],
    demons: ['misspiggy', 'uncledeadly', 'statler', 'waldorf'],
    travellers: ['bigbird', 'cookiemonster', 'countvoncount'],
  },
  {
    id: 'murder-on-the-dancefloor',
    name: 'Murder on the Dancefloor',
    townsfolk: [
      'sexmastare',
      'export',
      'provelev',
      'bar',
      'itk',
      'balettledare',
      'trivselombud',
      'stamledare',
      'arkivarie',
      'medaljeri',
      'prylprov',
      'materialforvaltare',
      'pr',
    ],
    outsiders: ['kuppbar', 'puff', 'theclique', 'kamerer'],
    minions: ['notmarsk', 'dirigent', 'piff', 'spexare'],
    demons: ['deathbox', 'styrelse', 'sekreterare', 'gammaldryg'],
    travellers: ['lekstek', 'delilah'],
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

export const CAROUSEL_EDITIONS: readonly Edition[] = [
  {
    id: 'boozling',
    name: 'Boozling',
    townsfolk: [
      'noble',
      'pixie',
      'highpriestess',
      'balloonist',
      'fortuneteller',
      'oracle',
      'savant',
      'philosopher',
      'huntsman',
      'fisherman',
      'slayer',
      'sage',
      'cannibal',
    ],
    outsiders: ['drunk', 'mutant', 'damsel', 'klutz', 'golem'],
    minions: ['baron', 'cerenovus', 'scarletwoman', 'marionette'],
    demons: ['nodashii', 'fanggu', 'imp'],
    travellers: ['thief', 'deviant', 'bonecollector', 'butcher', 'barista'],
  },
  {
    id: 'catfishing',
    name: 'Catfishing',
    townsfolk: [
      'balloonist',
      'cannibal',
      'chef',
      'dreamer',
      'fortuneteller',
      'gambler',
      'grandmother',
      'philosopher',
      'ravenkeeper',
      'savant',
      'snakecharmer',
      'amnesiac',
      'investigator',
    ],
    outsiders: ['drunk', 'lunatic', 'mutant', 'recluse', 'sweetheart'],
    minions: ['cerenovus', 'godfather', 'pithag', 'widow'],
    demons: ['vigormortis', 'fanggu', 'imp'],
    travellers: [],
  },
  {
    id: 'devout-theists',
    name: 'Devout Theists',
    townsfolk: [
      'noble',
      'chef',
      'pixie',
      'highpriestess',
      'mathematician',
      'flowergirl',
      'savant',
      'amnesiac',
      'juggler',
      'fisherman',
      'farmer',
      'magician',
      'cannibal',
    ],
    outsiders: ['puzzlemaster', 'klutz', 'golem', 'snitch'],
    minions: ['widow', 'goblin', 'psychopath', 'marionette'],
    demons: ['lleech', 'fanggu', 'kazali', 'legion'],
    travellers: [],
  },
  {
    id: 'nobody-fucking-move',
    name: 'Nobody Fucking Move',
    townsfolk: [
      'snakecharmer',
      'alsaahir',
      'slayer',
      'philosopher',
      'alchemist',
      'virgin',
    ],
    outsiders: ['klutz', 'heretic', 'damsel'],
    minions: ['psychopath', 'goblin', 'boomdandy'],
    demons: ['pukka', 'vortox'],
    travellers: [],
  },
  {
    id: 'you-only-have-one-shot',
    name: 'You only have one shot!',
    townsfolk: [
      'nightwatchman',
      'philosopher',
      'professor',
      'artist',
      'slayer',
      'fisherman',
    ],
    outsiders: ['hermit', 'drunk'],
    minions: ['godfather', 'assassin'],
    demons: ['imp'],
    travellers: [],
  },
  {
    id: 'fall-of-rome-teensyville',
    name: 'Fall of Rome - Teensyville',
    townsfolk: [
      'sculptor',
      'trumpeter',
      'standardbearer',
      'centurion',
      'blacksmith',
      'scholar',
    ],
    outsiders: ['spartacus', 'badomen'],
    minions: ['haruspex', 'augur'],
    demons: ['cleopatra', 'crassus'],
    travellers: [],
  },
];

export const getAllCharacters = (
  edition: Edition,
  includeTravellers: boolean = true,
) =>
  (includeTravellers
    ? CHARACTER_TYPES
    : CHARACTER_TYPES.filter((t) => t !== 'travellers')
  ).flatMap((t) => edition[t]);

const _CHARACTER_TYPE_MAP = EDITIONS.reduce((acc, edition) => {
  for (const type of CHARACTER_TYPES) {
    for (const characterId of edition[type]) {
      acc.set(characterId, type);
    }
  }
  return acc;
}, new Map<CharacterId, CharacterType>());
export const getType = (id: CharacterId) =>
  _CHARACTER_TYPE_MAP.get(id) ?? 'townsfolk';

const _EDITION_MAP = EDITIONS.reduce((acc, edition) => {
  for (const characterId of getAllCharacters(edition)) {
    acc.set(characterId, edition.id);
  }
  return acc;
}, new Map<CharacterId, string>());
export const getEdition = (id: CharacterId): string =>
  _EDITION_MAP.get(id) ?? 'custom';

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

const POCKET_GRIMOIRE_BASE_URL = 'https://www.pocketgrimoire.co.uk/en_GB/sheet';
export const toPocketGrimoireUrl = (edition: Edition) =>
  `${POCKET_GRIMOIRE_BASE_URL}?name=${edition.name.replaceAll(
    ' ',
    '+',
  )}&characters=${encodeURIComponent(getAllCharacters(edition).join(','))}`;

const parsePocketGrimoireUrl = (url: string): Edition => {
  const searchParams = new URLSearchParams(url.split('?')[1]);
  const name =
    searchParams.get('name')?.replaceAll('+', ' ') ?? 'Unknown Script';
  const id = name.trim().toLowerCase().replaceAll(' ', '-');
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

const BOTC_SCRIPTS_BASE_URL = 'https://www.botcscripts.com';
type BotcScriptJsonEntry = BotcMetadata | BotcScriptJsonCharacterEntry;
type BotcScriptJsonCharacterEntry =
  | BotcCharacterJson
  | { id: CharacterId }
  | CharacterId;
interface BotcMetadata {
  id: string;
  author: string;
  name: string;
}

interface SpecialRule {
  name: string;
  type: string;
}

interface BotcCharacterJson {
  id: string;
  name: string;
  image: string;
  ability: string;
  firstNight?: number;
  firstNightReminder?: string;
  otherNight?: number;
  otherNightReminder?: string;
  reminders: string[];
  remindersGlobal?: string[];
  setup?: boolean;
  team: string;
  special?: SpecialRule[];
}

const TEAM_MAP: Record<CharacterType, string> = {
  townsfolk: 'townsfolk',
  outsiders: 'outsider',
  minions: 'minion',
  demons: 'demon',
  travellers: 'traveller',
};

const HAS_SETUP_REGEX = /.*\[.*\]/;

const characterToJson = (characterId: CharacterId, baseUrl: string) => {
  const character = CHARACTERS[characterId];

  const special: SpecialRule[] = [];

  if (character.cannotBeSelected) {
    special.push({ name: 'bag-disabled', type: 'selection' });
  }

  const imgPath = character.image?.[0];

  return {
    id: character.id,
    name: character.name,
    image: imgPath?.startsWith('/') ? `https://${baseUrl}${imgPath}` : imgPath,
    ability: character.description,
    firstNight: character.nightReminders.first?.index,
    firstNightReminder: character.nightReminders.first?.text,
    otherNight: character.nightReminders.other?.index,
    otherNightReminder: character.nightReminders.other?.text,
    reminders: character.reminderTokens?.slice() ?? [],
    remindersGlobal: character.reminderTokensGlobal,
    setup: HAS_SETUP_REGEX.test(character.description) ? true : undefined,
    team: TEAM_MAP[character.team],
  } as BotcCharacterJson;
};

// const isOfficialCharacter = (characterId: CharacterId) =>
//   [
//     'trouble-brewing',
//     'bad-moon-rising',
//     'sects-and-violets',
//     'carousel',
//   ].includes(getEdition(characterId));

export const editionToJson = (edition: Edition, baseUrl: string) => {
  const data = [];

  data.push({
    id: '_meta',
    name: edition.name,
    isOfficial: false,
  });

  for (const character of getAllCharacters(edition)) {
    data.push(characterToJson(character, baseUrl));
  }

  return data;
};

const isCharacterId = (data: BotcScriptJsonEntry): data is CharacterId =>
  typeof data === 'string' && data in CHARACTERS;
// const isCharacter = (data: BotcScriptJsonEntry): data is { id: CharacterId } =>
//   typeof data !== 'string' && 'id' in data && !('name' in data);
const isMetadata = (data: BotcScriptJsonEntry): data is BotcMetadata =>
  !isCharacterId(data) && 'name' in data && !('ability' in data);

const isCustomCharacter = (
  data: BotcScriptJsonEntry,
): data is BotcCharacterJson =>
  !isCharacterId(data) &&
  !isMetadata(data) &&
  'ability' in data &&
  !(data.id in CHARACTERS);

const getCharacterIdFromJsonEntry = (data: BotcScriptJsonEntry) =>
  isCharacterId(data) ? data : (data.id.replaceAll('_', '') as CharacterId);

export const botcCharacterFromJson = (
  data: BotcScriptJsonCharacterEntry,
): BotcCharacter => {
  // Check if it's an official character
  if (isCharacterId(data)) {
    return CHARACTERS[data];
  } else if (!isCustomCharacter(data)) {
    return CHARACTERS[data.id];
  }

  const firstNightReminder =
    data.firstNight !== undefined && data.firstNightReminder !== undefined
      ? {
          text: data.firstNightReminder,
          index: data.firstNight,
        }
      : undefined;
  const otherNightReminder =
    data.otherNight !== undefined && data.otherNightReminder !== undefined
      ? {
          text: data.otherNightReminder,
          index: data.otherNight,
        }
      : undefined;

  const cannotBeSelected =
    data.special?.find(
      (rule) => rule.name === 'bag-disabled' && rule.type === 'selection',
    ) !== undefined
      ? true
      : undefined;

  return {
    id: data.id as CharacterId,
    name: data.name,
    description: data.ability,
    reminderTokens: data.reminders,
    reminderTokensGlobal: data.remindersGlobal,
    team: (data.team === 'townsfolk'
      ? data.team
      : `${data.team}s`) as CharacterType,
    image: [data.image, data.image],
    nightReminders: {
      first: firstNightReminder,
      other: otherNightReminder,
    },
    cannotBeSelected,
  };
};

type BotcScriptsJsonData = [
  BotcMetadata | BotcScriptJsonCharacterEntry,
  ...BotcScriptJsonCharacterEntry[],
];
const jsonToEdition = (data: BotcScriptsJsonData) => {
  const firstElement = data[0];
  const name = isMetadata(firstElement) ? firstElement.name : '';
  const characters = data.slice(
    isMetadata(firstElement) ? 1 : 0,
  ) as BotcScriptJsonCharacterEntry[];
  const edition = characters.reduce<Edition>(
    (acc, character) => {
      const characterId = getCharacterIdFromJsonEntry(character);
      acc[getType(characterId)].push(characterId);
      return acc;
    },
    {
      id: name.toLowerCase().trim().replaceAll(' ', '-'),
      name,
      townsfolk: [],
      outsiders: [],
      minions: [],
      demons: [],
      travellers: [],
    },
  );
  return edition;
};

const JSON_REGEX = /^\s*\[\s*{\s*"id"\s*:/;
export const urlToEdition = async (url: string): Promise<Edition | null> => {
  const parseUrl = async (url: string) => {
    if (JSON_REGEX.test(url)) {
      return jsonToEdition(JSON.parse(url) as BotcScriptsJsonData);
    } else if (url.includes(POCKET_GRIMOIRE_BASE_URL)) {
      return parsePocketGrimoireUrl(url);
    } else if (url.includes(BOTC_SCRIPTS_BASE_URL)) {
      return jsonToEdition(
        (await (await fetch(url)).json()) as BotcScriptsJsonData,
      );
    }
  };
  const edition = await parseUrl(url);
  if (!edition) {
    return null;
  }
  return {
    ...edition,
    id: edition.name.trim().toLowerCase().replaceAll(' ', '-'),
  };
};

const ABBREVIATIONS: Record<string, string> = {
  'trouble-brewing': 'tb',
  'bad-moon-rising': 'bmr',
  'sects-and-violets': 'snv',
  carousel: 'carousel',
  custom: 'carousel',
};
const isFallOfRomeCharacter = (id: CharacterId) =>
  getEdition(id).includes('fall-of-rome');
const isMuppetsOnAClocktowerCharacter = (id: CharacterId) =>
  getEdition(id).includes('muppets-on-a-clocktower');
const isMurderOnTheDancefloorCharacter = (id: CharacterId) =>
  getEdition(id).includes('murder-on-the-dancefloor');

const baseImgUrl = `https://release.botc.app/resources/characters/<EDITION>/<NAME><ALIGNMENT>.webp`;
const fallOfRomeBaseImgUrl = '/botc/Fall_of_Rome/<NAME>_fall_of_rome.webp';
const muppetsOnAClocktowerBaseImgUrl =
  '/botc/Muppets_on_a_Clocktower/<NAME>.webp';
const murderOnTheDanceFloorBaseImgUrl =
  '/botc/Murder_on_the_Dancefloor/<NAME>.webp';
const getImagePathFromId = (id: CharacterId) => {
  if (isFallOfRomeCharacter(id)) {
    // Centurion, Glykon and High Priest are stored at <name>1
    const name = ['centurion', 'glykon', 'highpriest'].includes(id)
      ? `${id}1`
      : id;
    return fallOfRomeBaseImgUrl.replace('<NAME>', name);
  } else if (isMuppetsOnAClocktowerCharacter(id)) {
    return muppetsOnAClocktowerBaseImgUrl.replace('<NAME>', id);
  } else if (isMurderOnTheDancefloorCharacter(id)) {
    return murderOnTheDanceFloorBaseImgUrl.replace('<NAME>', id);
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
  'fall-of-rome-teensyville',
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
  reminderTokensGlobal?: readonly string[];
  setupFunction?: (players: BotcPlayer[]) => BotcPlayer[];
  team: CharacterType;
  image?: [string, string];
  nightReminders: {
    first?: {
      text: string;
      index: number;
    };
    other?: {
      text: string;
      index: number;
    };
  };
  cannotBeSelected?: boolean;
  disguisedAs?: readonly CharacterType[];
}

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
    reminderTokensGlobal: ['Is the Drunk'],
    cannotBeSelected: true,
    disguisedAs: ['townsfolk'],
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
    reminderTokens: ['Everyone is drunk'],
  },
  tealady: {
    name: 'Tea Lady',
    description: "If both your alive neighbors are good, they can't die.",
    reminderTokens: ['Cannot die', 'Cannot die'],
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
    reminderTokens: ['Killed by', 'Killed by', 'Alive'],
  },
  po: {
    name: 'Po',
    description:
      'Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.',
    reminderTokens: ['Killed by', 'Killed by', 'Killed by', '3 attacks'],
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
    reminderTokens: [
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
      'Worked abnormally',
    ],
  },
  flowergirl: {
    name: 'Flowergirl',
    description: 'Each night*, you learn if a Demon voted today.',
    reminderTokens: ['Demon voted'],
  },
  towncrier: {
    name: 'Town Crier',
    description: 'Each night*, you learn if a Minion nominated today.',
    reminderTokens: ['Minion has nominated'],
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
    reminderTokensGlobal: ['Is the Philosopher'],
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
    reminderTokens: ['Correct', 'Correct', 'Correct', 'Correct', 'Correct'],
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
    reminderTokens: [
      'Killed by',
      'Has ability',
      'Has ability',
      'Has ability',
      'Poisoned',
      'Poisoned',
      'Poisoned',
    ],
  },
  nodashii: {
    name: 'No Dashii',
    description:
      'Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned.',
    reminderTokens: ['Killed by', 'Poisoned', 'Poisoned'],
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
    reminderTokens: ['Killed by', 'Killed by'],
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
    reminderTokens: ['Patient', 'Patient', '1st Demon'],
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
    reminderTokens: [
      'Evil claim',
      'Evil claim',
      'Evil claim',
      'Evil claim',
      'Evil claim',
      'Evil claim',
      'Evil claim',
      'Evil claim',
    ],
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
    reminderTokens: ['Correct', 'Correct', 'Correct', 'No ability'],
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
    reminderTokens: ['Townsfolk are drunk', 'Twin'],
  },
  winemaker: {
    name: 'Winemaker',
    description:
      'Your Townsfolk neighbours are drunk, but every other night, you are drunk until dusk, even if you are dead.',
    reminderTokens: ['Odd', 'Even', 'Drunk', 'Drunk'],
  },
  spartacus: {
    name: 'Spartacus',
    description:
      "If an evil player guesses you (once), your team loses. You might register as a Townsfolk; each day, if you did not publicly claim to be Spartacus, you don't.",
    reminderTokensGlobal: [
      'Claimed Spartacus',
      'Claimed Spartacus',
      'Claimed Spartacus',
      'Claimed Spartacus',
      'Claimed Spartacus',
      'Claimed Spartacus',
      'Claimed Spartacus',
      'Claimed Spartacus',
    ],
    reminderTokens: ['Guess used'],
  },
  badomen: {
    name: 'Bad Omen',
    description:
      'You do not know you are a Bad Omen. You think you are a Townsfolk, but you receive false information. You might register as evil, even if dead.',
    reminderTokensGlobal: ['Is the Bad Omen'],
    cannotBeSelected: true,
    disguisedAs: ['townsfolk'],
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
    reminderTokens: [
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Foretold',
      'Dead',
      "Can't kill",
    ],
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
    reminderTokens: [
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
      'Is the Bad Omen',
    ],
  },

  // Fall of Rome - Demons
  cleopatra: {
    name: 'Cleopatra',
    description:
      "Each night, choose two players: if they nominate tomorrow, they die that night. Each day, if a good player (Travellers don't count) does not nominate, evil wins.",
    reminderTokens: ['Chosen by', 'Chosen by', 'Killed by', 'Killed by'],
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
    reminderTokensGlobal: [
      'Is Hannibal',
      'Is Hannibal',
      'Killed by',
      'Killed by',
    ],
    cannotBeSelected: true,
    disguisedAs: ['townsfolk', 'outsiders'],
  },
  caesar: {
    name: 'Caesar',
    description:
      'Each night*, choose a player: they die. The 1st time an evil player dies by execution, that night, choose an additional player: they die.',
    reminderTokens: ['Betrayal', 'Kill used', 'Killed by', 'Killed by'],
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

  // Muppets on a Clocktower - Townsfolk
  bunsenhoneydew: {
    name: `Bunsen Honeydew`,
    description: `You start knowing how many characters are in play that can create Humans.`,
  },
  rowlfthedog: {
    name: `Rowlf the Dog`,
    description: `You start knowing 2 players who are not Townsfolk.`,
    reminderTokens: ['Not Townsfolk', 'Not Townsfolk'],
  },
  pepetheprawn: {
    name: `Pepe the Prawn`,
    description: `You start knowing which Demons are in play.`,
  },
  samtheeagle: {
    name: `Sam the Eagle`,
    description: `Each night, you learn how many steps from you to an alive evil player. [+1 Human]`,
    reminderTokens: ['Is Human'],
  },
  kermitthefrog: {
    name: `Kermit the Frog`,
    description: `Each night*, choose a player (not yourself): a Human, if chosen, becomes a Townsfolk.`,
  },
  camillathechicken: {
    name: `Camilla the Chicken`,
    description: `Each night*, if a player died by execution today: you learn a player of their alignment.`,
    reminderTokens: ['Executed today'],
  },
  sweetums: {
    name: `Sweetums`,
    description: `Each night*, you learn how many evil players voted today.`,
    reminderTokens: [
      'Evil voted',
      'Evil voted',
      'Evil voted',
      'Evil voted',
      'Evil voted',
      'Evil voted',
      'Evil voted',
      'Evil voted',
    ],
  },
  swedishchef: {
    name: `Swedish Chef`,
    description: `Each night*, you learn if there are more or less Humans than last night. If you were non-verbal on the 1st day, you instead learn how many Humans are in play.`,
    reminderTokens: ['Non-verbal'],
  },
  thegreatgonzo: {
    name: `The Great Gonzo`,
    description: `Each night*, you may choose a player: if you choose a Minion they die, if you choose a Townsfolk you die.`,
    reminderTokens: ['Killed by'],
  },
  rizzotherat: {
    name: `Rizzo the Rat`,
    description: `Each night*, choose a player: if they are killed by the Demon tonight, you learn an alive character.`,
    reminderTokens: ['Chosen'],
  },
  fozziebear: {
    name: `Fozzie Bear`,
    description: `Each day, you may make a public joke. Wocka! Wocka! Tonight, you learn if it was true.`,
    reminderTokens: ['True'],
  },
  beaker: {
    name: `Beaker`,
    description: `If you were non-verbal on the 1st day, that night you learn the characters of players who were non-verbal (up to 4) & one character which is not in play.`,
    reminderTokens: [
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
      'Non-verbal',
    ],
  },
  drteeth: {
    name: `Dr. Teeth`,
    description: `If the Demon kills you, a Human becomes a Townsfolk: you learn who.`,
    reminderTokens: ['Changed'],
  },

  // Muppets on a Clocktower - Outsiders
  longjohnsilver: {
    name: `Long John Silver`,
    description: `Each night*, one player who voted on you that day might die, even if you are dead.`,
    reminderTokens: [
      'Killed by',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
      'Voted',
    ],
  },
  scrooge: {
    name: `Scrooge`,
    description: `Each night, if a player chooses another player, they might target you instead.`,
    reminderTokens: ['Scrooged'],
  },
  cameraman: {
    name: `Cameraman`,
    description: `If you communicate verbally on the 1st day, a Townsfolk might become Human immediately.`,
    reminderTokens: ['Blooper'],
  },
  human: {
    name: `Human`,
    description: `You do not know you are a Human. You think you are a Townsfolk character, but you are not.`,
    reminderTokensGlobal: [
      'Is Human',
      'Is Human',
      'Is Human',
      'Is Human',
      'Is Human',
      'Is Human',
      'Is Human',
      'Is Human',
      'Is Human',
    ],
    cannotBeSelected: true,
    disguisedAs: ['townsfolk'],
  },

  // Muppets on a Clocktower - Minions
  crazyharry: {
    name: `Crazy Harry`,
    description: `Each night*, choose a player: the 1st Outsider you choose becomes evil. [+1 Outsider]`,
    reminderTokens: ['Turned evil'],
  },
  animal: {
    name: `Animal`,
    description: `Once per game, at night*, choose a player: they die. If you were non-verbal on the 1st day, one of their Townsfolk neighbours become Human.`,
    reminderTokens: ['Non-verbal', 'Killed by', 'No ability'],
  },
  constantine: {
    name: `Constantine`,
    description: `Each night*, you may choose 2 players (not a Demon): they swap characters but their abilities do not refresh.`,
  },
  scooter: {
    name: `Scooter`,
    description: `If there are 5 or more players alive, once per day, you may choose to take a player off the block.`,
    reminderTokens: ['Used today', 'No ability'],
  },

  // Muppets on a Clocktower - Demons
  misspiggy: {
    name: `Miss Piggy`,
    description: `Each night*, choose a player: they die. Townsfolk chosen by Kermit the Frog might become Human instead. [+Kermit the Frog]`,
    reminderTokens: ['Killed by', 'Corrupted'],
  },
  uncledeadly: {
    name: `Uncle Deadly`,
    description: `Each night*, choose a player: they die. Townsfolk who nominate you become Human immediately.`,
    reminderTokens: ['Killed by'],
  },
  statler: {
    name: `Statler`,
    description: `Each night*, wake with Waldorf, together choose one player: they die. [+Waldorf, -1 Minion]`,
    reminderTokens: ['Killed by'],
  },
  waldorf: {
    name: `Waldorf`,
    description: `Each night*, wake with Statler, together choose one player: they die. [+Statler]`,
  },

  // Muppets on a Clocktower - Travellers
  bigbird: {
    name: 'Big Bird',
    description: 'You are the tallest player.',
  },
  cookiemonster: {
    name: 'Cookie Monster',
    description: 'All players must share their snacks with you.',
  },
  countvoncount: {
    name: 'Count von Count',
    description: 'You conduct and count each vote. AH AH AH.',
  },

  // Murder on the Dancefloor - Townsfolk
  sexmastare: {
    name: `Sexmästare`,
    description: `You start knowing 3 characters, 2 of which are in-play.`,
  },
  export: {
    name: 'Export',
    description:
      'You start knowing how many characters which can cause drunkenness are in-play.',
  },
  provelev: {
    name: `Provelev`,
    description: `You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.`,
    reminderTokens: ['Mad as'],
  },
  bar: {
    name: `Bar`,
    description: `Each night, you learn how many players are drunk.`,
  },
  itk: {
    name: `ITK`,
    description: `Each night, you learn how many players woke tonight due to their ability.`,
  },
  balettledare: {
    name: `Balettledare`,
    description: `Each night, choose a player: they are sober until dusk. You cannot be drunk.`,
    reminderTokens: ['Sober'],
  },
  trivselombud: {
    name: `Trivselombud`,
    description: `Each night, you learn all players which were chosen tonight by an evil player.`,
    reminderTokens: [
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
      'Chosen by evil',
    ],
  },
  stamledare: {
    name: `Stämledare`,
    description: `Each night, choose a player: tonight, you learn any info they learn due to their ability.`,
    reminderTokens: ['Forwarded'],
  },
  arkivarie: {
    name: `Arkivarie`,
    description: `Each night*, you learn a character who died today or tonight.`,
  },
  medaljeri: {
    name: `Medaljeri`,
    description: `Each night*, choose a player: until dusk, they may use their ability, even if dead.`,
    reminderTokens: ['Medal awarded'],
  },
  prylprov: {
    name: `Pryl & Prov`,
    description: `Each night*, choose a player: the 1st Outsider chosen becomes a not-in-play Townsfolk. If a Minion is chosen, you become drunk. [+0 to +1 Outsider]`,
    reminderTokens: ['Drunk', 'Recruited'],
  },
  materialforvaltare: {
    name: `Materialförvaltare`,
    description: `Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.`,
    reminderTokens: ['No ability', 'Resurrected'],
  },
  pr: {
    name: `PR`,
    description: `Once per game, during the day, publicly choose a good character. If not-in-play, a Townsfolk immediately becomes the chosen character.`,
    reminderTokens: ['No ability'],
  },

  // Murder on the Dancefloor - Outsiders
  kuppbar: {
    name: `Kuppbar`,
    description: `Each night, choose an alive player (not yourself): if the last chosen player is a Townsfolk, they are drunk, even if you are dead.`,
    reminderTokens: ['Drunk'],
  },
  puff: {
    name: `Puff`,
    description: `Each night, choose an alive player (not yourself): Piff learns who you chose and their character. If a good player is chosen twice by you, they die. [+Piff]`,
    reminderTokens: [
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
      'Chosen',
    ],
  },
  theclique: {
    name: `The Clique`,
    description: `On your 1st night, choose a player: you are mad that they are evil and must vote when they are nominated or you might be executed.`,
    reminderTokens: ['Cliqued'],
  },
  kamerer: {
    name: `Kamerer`,
    description: `When you die, that night, choose an alive player: if not the Demon, they become a not-in-play Outsider.`,
  },

  // Murder on the Dancefloor - Minions
  notmarsk: {
    name: 'Notmarsk',
    description:
      'Each night, choose a player: move them either first or last in the night order.',
    reminderTokens: ['First', 'Last'],
  },
  dirigent: {
    name: 'Dirigent',
    description:
      'Each night, choose a player: if they make a choice tonight, you learn their choice and may change it.',
    reminderTokens: ['Conducted'],
  },
  piff: {
    name: 'Piff',
    description:
      'Each night, choose a player. Townsfolk that have been chosen by you receive info an additional time which may be incorrect.',
    reminderTokens: [
      'Piffed',
      'Piffed',
      'Piffed',
      'Piffed',
      'Piffed',
      'Piffed',
      'Piffed',
      'Piffed',
      'Piffed',
    ],
  },
  spexare: {
    name: 'Spexare',
    description:
      'Once per game, at night, choose two players: one of them becomes evil, the other is drunk.',
    reminderTokens: ['Evil', 'Drunk', 'No ability'],
  },

  // Murder on the Dancefloor - Demons
  deathbox: {
    name: 'Deathbox',
    description:
      'Each night, choose a player: they are drunk. The previously chosen player dies then becomes sober.',
    reminderTokens: ['Killed by', 'Drunk'],
  },
  styrelse: {
    name: 'Styrelse',
    description:
      'Each night*, choose a character: they die. If they are not-in-play, the Storyteller chooses who dies.',
    reminderTokens: ['Killed by'],
  },
  sekreterare: {
    name: 'Sekreterare',
    description:
      "Each night*, choose a player: they die. If you publicly guess all player's characters (once), your team wins. [+1 Outsider]",
    reminderTokens: ['Killed by'],
  },
  gammaldryg: {
    name: 'Gammal & Dryg',
    description:
      'You think you are a Townsfolk character, but you are not. Each night*, a player might die. If there are 5 or more players alive & the 1st Gammal & Dryg dies by execution, the nominator becomes an evil Gammal & Dryg.',
    reminderTokensGlobal: [
      'Killed by',
      'Is Gammal & Dryg',
      '1st Gammal & Dryg',
    ],
    cannotBeSelected: true,
    disguisedAs: ['townsfolk'],
  },

  // Murder on the Dancefloor - Travellers
  lekstek: {
    name: 'Lek & Stek',
    description:
      'Each day, you may publicly choose a sound. Tonight, that sound may be played.',
  },
  delilah: {
    name: 'Delilah',
    description:
      'When a Townsfolk or Minion is about to die, you change to their alignment.',
  },

  // Carousel - Townsfolk
  acrobat: {
    name: 'Acrobat',
    description:
      'Each night*, choose a player: if they are or become drunk or poisoned tonight, you die.',
    reminderTokens: ['Partner'],
  },
  alchemist: {
    name: 'Alchemist',
    description:
      'You have a Minion ability. When using this, the Storyteller may prompt you to choose differently.',
    reminderTokensGlobal: ['Is the Alchemist'],
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
    reminderTokens: ['1', '2', '3'],
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
    reminderTokens: ['Know'],
  },
  banshee: {
    name: 'Banshee',
    description:
      'If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination.',
    reminderTokens: ['Has ability'],
  },
  bountyhunter: {
    name: 'Bounty Hunter',
    description:
      'You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]',
    reminderTokens: ['Know'],
  },
  cannibal: {
    name: 'Cannibal',
    description:
      'You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution.',
    reminderTokens: ['Lunch', 'Poisoned'],
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
    reminderTokens: ['No ability'],
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
    reminderTokens: ['No ability'],
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
    reminderTokens: ['No ability'],
  },
  king: {
    name: 'King',
    description:
      'Each night, if the dead equal or outnumber the living, you learn 1 alive character. The Demon knows you are the King.',
  },
  knight: {
    name: 'Knight',
    description: 'You start knowing 2 players that are not the Demon.',
    reminderTokens: ['Know', 'Know'],
  },
  lycanthrope: {
    name: 'Lycanthrope',
    description:
      'Each night*, choose an alive player. If good, they die & the Demon doesn’t kill tonight. One good player registers as evil.',
    reminderTokens: ['Faux Paw', 'Killed by'],
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
    reminderTokens: ['No ability'],
  },
  noble: {
    name: 'Noble',
    description: 'You start knowing 3 players, 1 and only 1 of which is evil.',
    reminderTokens: ['Know', 'Know', 'Know'],
  },
  pixie: {
    name: 'Pixie',
    description:
      'You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.',
    reminderTokens: ['Mad as'],
  },
  poppygrower: {
    name: 'Poppy Grower',
    description:
      'Minions & Demons do not know each other. If you die, they learn who each other are that night.',
    reminderTokens: ['Evil wakes'],
  },
  princess: {
    name: 'Princess',
    description:
      "On your 1st day, if you nominated & executed a player, the Demon doesn't kill tonight.",
    reminderTokens: ["Doesn't kill"],
  },
  preacher: {
    name: 'Preacher',
    description:
      'Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability.',
    reminderTokens: [
      'Ability disabled',
      'Ability disabled',
      'Ability disabled',
    ],
  },
  shugenja: {
    name: 'Shugenja',
    description:
      'You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary.',
  },
  steward: {
    name: 'Steward',
    description: 'You start knowing 1 good player.',
    reminderTokens: ['Know'],
  },
  villageidiot: {
    name: 'Village Idiot',
    description:
      'Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots. 1 of the extras is drunk]',
    reminderTokens: ['Drunk'],
  },

  // Carousel - Outsiders
  damsel: {
    name: 'Damsel',
    description:
      'All Minions know a Damsel is in play. If a Minion publicly guesses you (once), your team loses.',
    reminderTokens: ['Guess used'],
  },
  golem: {
    name: 'Golem',
    description:
      'You may only nominate once per game. When you do, if the nominee is not the Demon, they die.',
    reminderTokens: ['May not nominate'],
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
    reminderTokens: ['Tea party tonight'],
  },
  ogre: {
    name: 'Ogre',
    description:
      "On your 1st night, choose a player (not yourself): you become their alignment (you don't know which) even if drunk or poisoned.",
  },
  plaguedoctor: {
    name: 'Plague Doctor',
    description: 'When you die, the Storyteller gains a Minion ability.',
    reminderTokens: ['Storyteller ability'],
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
    reminderTokens: ['Drunk'],
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
    reminderTokens: ['Is the Demon'],
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
    reminderTokens: ['Fear'],
  },
  goblin: {
    name: 'Goblin',
    description:
      'If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.',
    reminderTokens: ['Claimed'],
  },
  harpy: {
    name: 'Harpy',
    description:
      'Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or one or both might die.',
    reminderTokens: ['Mad', '2nd'],
  },
  marionette: {
    name: 'Marionette',
    description:
      'You think you are a good character, but you are not. The Demon knows who you are. [You neighbor the Demon]',
    reminderTokensGlobal: ['Is the Marionette'],
    cannotBeSelected: true,
    disguisedAs: ['townsfolk', 'outsiders'],
  },
  mezepheles: {
    name: 'Mezepheles',
    description:
      'You start knowing a secret word. The 1st good player to say this word becomes evil that night.',
    reminderTokens: ['Turns evil'],
  },
  organgrinder: {
    name: 'Organ Grinder',
    description:
      'All players keep their eyes closed when voting and the vote tally is secret. Each night, choose if you are drunk until dusk.',
    reminderTokens: ['Drunk'],
  },
  summoner: {
    name: 'Summoner',
    description:
      'You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]',
    reminderTokens: ['Night 1', 'Night 2', 'Night 3'],
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
    reminderTokens: ['Know', 'Poisoned'],
  },
  wizard: {
    name: 'Wizard',
    description:
      'Once per game, choose to make a wish. If granted, it might have a price & leave a clue as to its nature.',
    reminderTokens: ['Wish used'],
  },
  xaan: {
    name: 'Xaan',
    description:
      'On night X, all Townsfolk are poisoned until dusk. [X Outsiders]',
    reminderTokens: ['Townsfolk are poisoned'],
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
    reminderTokens: ['Killed by'],
  },
  alhadikhia: {
    name: 'Al-Hadikhia',
    description:
      'Each night*, you may choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die.',
    reminderTokens: ['Killed by', 'Killed by', 'Killed by', '1', '2', '3'],
  },
  kazali: {
    name: 'Kazali',
    description:
      'Each night*, choose a player: they die. [You choose which players are which Minions. -? to +? Outsiders]',
    reminderTokens: ['Killed by'],
  },
  legion: {
    name: 'Legion',
    description:
      'Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]',
    reminderTokens: ['Killed by'],
  },
  leviathan: {
    name: 'Leviathan',
    description:
      'If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins.',
    reminderTokens: ['Good player executed'],
  },
  lilmonsta: {
    name: "Lil'Monsta",
    description: `Each night, Minions choose who babysits Lil' Monsta & "is the Demon". Each night*, a player might die. [+1 Minion]`,
    reminderTokensGlobal: ['Killed by', 'Is the Demon'],
  },
  lleech: {
    name: 'Lleech',
    description:
      'Each night*, choose a player: they die. You start by choosing a player: they are poisoned. You die if & only if they are dead.',
    reminderTokens: ['Killed by', 'Poisoned'],
  },
  lordoftyphon: {
    name: 'Lord of Typhon',
    description:
      'Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. -? to +? Outsiders]',
    reminderTokens: ['Killed by'],
  },
  ojo: {
    name: 'Ojo',
    description:
      'Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies.',
    reminderTokens: ['Killed by'],
  },
  yaggababble: {
    name: 'Yaggababble',
    description:
      'You start knowing a secret phrase. For each time you said it publicly today, a player might die.',
    reminderTokens: ['Killed by', 'Said phrase'],
  },

  // Carousel - Travellers
  cacklejack: {
    name: 'Cacklejack',
    description:
      'Each day, choose a player; a different player changes character tonight.',
    reminderTokens: ['Not me'],
  },

  gangster: {
    name: 'Gangster',
    description:
      'Once per day, you may choose to kill an alive neighbor, if your other alive neighbor agrees.',
  },
  gnome: {
    name: 'Gnome',
    description:
      'All players start knowing a player of your alignment. You may choose to kill anyone who nominates them.',
    reminderTokens: ['Amigo'],
  },
} as const;

export type CharacterId = keyof typeof _characters;

export interface Reminder {
  characterId?: CharacterId | Alignment;
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

export interface NightOrderAbility {
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
      "The Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the Philosopher token with the chosen character. If the character is in play, place the Drunk marker by that player.",
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
    id: 'dirigent',
    description: `The Dirigent points to a player. Mark that player with the 'Conducted' token. If the marked player makes a choice tonight, wake the Dirigent, show them the choice that was made and allow the Dirigent to change it before carrying out the effects.`,
  },
  {
    id: 'notmarsk',
    description: `The Notmarsk points to a player, and then shows a thumbs up to move the chosen player first in the night order, or a thumbs down to move them last. Mark that player with the 'First' or 'Last' reminder token. If 'First' is marked and they are supposed to wake tonight, wake them now. If 'Last' is marked and they are supposed to wake tonight, wake them after everyone else has woken.`,
  },
  {
    id: 'spexare',
    description: `The Spexare either shows a 'no' head signal, or points to two players. Put the Spexare to sleep. If they chose two players: Mark one of them with 'Evil'. Wake that player and inform them of their new alignment. Mark the other player with 'Drunk'; they are drunk. Mark the Spexare with the 'No ability' token.`,
  },
  {
    id: 'puff',
    description:
      "Puff chooses a player: If the chosen player is good, mark that player with a 'Chosen' reminder token. Wake Piff, point to the chosen player and show their character token.",
  },
  {
    id: 'piff',
    description:
      "Piff chooses a player: If the chosen player is a Townsfolk, mark that player with the 'Piffed' token. Whenever a Townsfolk marked with 'Piffed' learns info, they learn it an additional time. This info may be incorrect.\n\n(Their ability info and the additional info may be given in any order, i.e. the info from their ability does not have to be given first.)",
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
      "The Devil's Advocate points to a living player. Mark that player with the 'Safe from execution' token; that player survives execution tomorrow.",
  },
  {
    id: 'eviltwin',
    description:
      'Wake the Evil Twin and their twin. Confirm that they have acknowledged each other. Point to the Evil Twin. Show their Evil Twin token to the twin player. Point to the twin. Show their character token to the Evil Twin player.',
  },
  {
    id: 'witch',
    description:
      "The Witch points to a player. Mark that player with the 'Cursed' token; if that player nominates tomorrow they die immediately.",
  },
  {
    id: 'cerenovus',
    description:
      "The Cerenovus points to a player, then to a character on their sheet. Mark that player with the 'Mad' token. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
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
    description:
      "The Pukka points to a player. Mark the chosen player with the 'Poisoned' token; that player is poisoned.",
  },
  {
    id: 'deathbox',
    description:
      "Deathbox points to a player. Mark the chosen player with the 'Drunk' token: they are drunk.",
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
    id: 'kuppbar',
    description: `The Kuppbar points to a player. Mark that player with the 'Drunk' token: they are drunk.`,
  },
  {
    id: 'balettledare',
    description: `The Balettledare points to a player. Mark that player as 'Sober'. They are sober until dusk.`,
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
    id: 'theclique',
    description: `The Clique points to a player. Mark that player with the 'Cliqued' token. The Clique is mad that the marked player is evil and must vote when they are nominated or might be executed.`,
  },
  {
    id: 'stamledare',
    description: `The Stämledare points to a player. Mark that player with the 'Forwarded' token. Whenever the marked player learns any info tonight due to their ability, also wake the Stämledare and show them the same info.`,
  },
  {
    id: 'trivselombud',
    description: `(Whenever an evil player chooses a player, mark them with the 'Chosen by evil' token.)\n\nPoint to each of the players marked with 'Chosen by evil'. Remove all 'Chosen by evil' tokens.`,
  },
  {
    id: 'pixie',
    description: `Show the Pixie 1 in-play Townsfolk character token. Mark that player with the 'Mad as' token.`,
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
    id: 'sexmastare',
    description: 'Show 3 character tokens, 2 of which are in-play.',
  },
  {
    id: 'export',
    description:
      'Count how many of the following characters are in play: Pryl & Prov, Kuppbar, Spexare & Deathbox. Show fingers equal to the number of the previously mentioned characters that are in play.',
  },
  {
    id: 'provelev',
    description: `Show the Provelev 1 in-play Townsfolk character token. Mark that player with the 'Mad as' token.`,
  },
  {
    id: 'bar',
    description:
      'Show the finger signal (0, 1, 2, etc.) for the number of currently drunk players.',
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
    id: 'bunsenhoneydew',
    description:
      'Count how many of the following characters are in play: Sam the Eagle, Cameraman, Animal, Miss Piggy & Uncle Deadly. Show fingers equal to the number of the previously mentioned characters that are in play.',
  },
  {
    id: 'rowlfthedog',
    description: `Point to the two players marked 'Not Townsfolk'.`,
  },
  {
    id: 'pepetheprawn',
    description: 'Show the character tokens of the Demons that are in play.',
  },
  {
    id: 'samtheeagle',
    description:
      'Show fingers (1, 2, 3, etc.) equaling the distance from Sam the Eagle to any alive evil player.',
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
      'Point to 3 players including exactly one evil player, in no particular order.',
  },
  {
    id: 'balloonist',
    description:
      "Point to a player. Place the 'Know' reminder token by that player.",
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
    id: 'itk',
    description: `Show the finger signal (0, 1, 2, etc.) for the number of players who woke tonight due to their ability (i.e. NOT waking for other reasons, e.g. Demon info).`,
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
    id: 'scrooge',
    description: `Whenever a player targets another player with their ability, you can instead choose for them to target Scrooge. Mark the affected player with the 'Scrooged' reminder token. The affected player does not know this happened.`,
  },
  {
    id: 'dirigent',
    description: `The Dirigent points to a player. Mark that player with the 'Conducted' token. If the marked player makes a choice tonight, wake the Dirigent, show them the choice that was made and allow the Dirigent to change it before carrying out the effects.`,
  },
  {
    id: 'notmarsk',
    description: `The Notmarsk points to a player, and then shows a thumbs up to move the chosen player first in the night order, or a thumbs down to move them last. Mark that player with the 'First' or 'Last' reminder token. If 'First' is marked and they are supposed to wake tonight, wake them now. If 'Last' is marked and they are supposed to wake tonight, wake them after everyone else has woken.`,
  },
  {
    id: 'spexare',
    description: `If the Spexare has not used their ability yet: the Spexare either shows a 'no' head signal, or points to two players. Put the Spexare to sleep. If they chose two players: Mark one of them with 'Evil'. Wake that player and inform them of their new alignment. Mark the other player with 'Drunk'; they are drunk. Mark the Spexare with the 'No ability' token.`,
  },
  {
    id: 'puff',
    description:
      "Puff chooses a player: If the chosen player is good, mark that player with a 'Chosen' reminder token, or kill them if they are already marked. Wake Piff, point to the chosen player and show their character token.",
  },
  {
    id: 'piff',
    description:
      "Piff chooses a player: If the chosen player is a Townsfolk, mark that player with the 'Piffed' token. Whenever a Townsfolk marked with 'Piffed' learns info, they learn it an additional time. This info may be incorrect.\n\n(Their ability info and the additional info may be given in any order, i.e. the info from their ability does not have to be given first.)",
  },
  {
    id: 'cacklejack',
    description:
      "Replace any player's character token (except the player with the 'Not me' reminder token) with a different character token. Wake that player, show the 'You are' info token and their new character token, then put them to sleep.",
  },
  {
    id: 'philosopher',
    description:
      "If the Philosopher has not used their ability: the Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token. Or, if the character is in play, place the drunk marker by that player and the Not the Philosopher token by the Philosopher.",
  },
  {
    id: 'cannibal',
    description:
      'Wake the Cannibal whenever the inherited character would wake and make them do whichever actions the inherited character would do. If the Cannibal is poisoned, you may wake them whenever the evil character would normally wake, and pretend they have a new ability.',
  },
  {
    id: 'poppygrower',
    description:
      'If the Poppy Grower has died, show the Minions/Demon who each other are.',
  },
  {
    id: 'thegreatgonzo',
    description: `The Great Gonzo either shakes their head no or point at any player. Put The Great Gonzo to sleep. If The Great Gonzo chose a Minion, that player dies. If The Great Gonzo chose a Townsfolk, The Great Gonzo dies.`,
  },
  {
    id: 'rizzotherat',
    description: `Rizzo the Rat points to any player, mark that player with the 'Chosen' reminder token.`,
  },
  {
    id: 'animal',
    description: `If this is the 2nd night and Animal was non-verbal during the day, place the 'Non-verbal' reminder token next to them.\n\nAnimal shakes their head no or points to a player. If Animal chose a player, they die. If Animal is marked with 'Non-verbal', choose one of the chosen player's Townsfolk neighbours to become a Human: mark that player with the 'Is Human' reminder token. Mark Animal with the 'No ability' reminder token; they no longer wake at night.`,
  },
  {
    id: 'crazyharry',
    description: `Crazy Harry points to any player. If Crazy Harry chose an Outsider and no player has the 'Turned evil' reminder token, mark the chosen player with the 'Turned evil' reminder token. Wake the Outsider to inform them of their alignment change by showing the 'You are' info token and giving a thumbs down.`,
  },
  {
    id: 'constantine',
    description: `Constantine either shakes their head no or points to two player (neither of which can be the Demon).\n\nIf Constantine chose two players, swap the character tokens of the two chosen players. One at a time, wake each swapped player, show them the 'You are' info token and their new character token, then put them to sleep. You may wish to remind them that their alignment has not changed.`,
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
      "The Devil's Advocate points to a living player, different from the previous night. Move the 'Safe from execution' token to the chosen player; that player survives execution tomorrow.",
  },
  {
    id: 'witch',
    description:
      "If there are 4 or more players alive: The Witch points to a player. Move the 'Cursed' token to the chosen player; if that player nominates tomorrow they die immediately.",
  },
  {
    id: 'cerenovus',
    description:
      "The Cerenovus points to a player, then to a character on their sheet. Mark that player with the 'Mad' token. Wake that player. Show the 'This character selected you' card with the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
  },
  {
    id: 'pithag',
    description:
      "The Pit-Hag points to a player and a character on the sheet.\n\nIf the character is in play, nothing happens. If this character is not in play, exchange the chosen player's character token with the chosen character token, then wake that player and show them the 'You are' card and their new character token. (You may wish to remind the player that their alignment hasn't changed.)",
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
      "The Pukka points to a player. Kill the player with the 'Poisoned' token, and then move the token to the chosen player; that player is poisoned.\n\n(If the Pukka is poisoned, do not move the 'Poisoned' token and do not kill any players.)",
  },
  {
    id: 'shabaloth',
    description:
      'One player that the Shabaloth chose the previous night might be resurrected. The Shabaloth points to two players. Those players die.',
  },
  {
    id: 'po',
    description:
      "If the Po chose no-one the previous night: The Po points to three players. Otherwise: The Po either shows the 'no' head signal, or points to a player. Chosen players die",
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
    id: 'misspiggy',
    description: `Miss Piggy points to a player. That player dies.`,
  },
  {
    id: 'uncledeadly',
    description: `Uncle Deadly points to a player. That player dies.`,
  },
  {
    id: 'statler',
    description: `Wake Statler & Waldorf (even if dead). They both point to any player. When they agree and both point to the same player, that player dies.`,
  },
  {
    id: 'deathbox',
    description:
      "Deathbox points to a player. Kill the player with the 'Drunk' token, and then move the token to the chosen player; that player is drunk.\n\n(If Deathbox is drunk, do not move the 'Drunk' token and do not kill any players.)",
  },
  {
    id: 'styrelse',
    description:
      'The Styrelse points to a character on the sheet; if in play, that player dies. If it is not in play, the Storyteller chooses who dies instead.',
  },
  {
    id: 'sekreterare',
    description: 'The Sekreterare points to a player. That player dies.',
  },
  {
    id: 'gammaldryg',
    description: 'For each alive Gammal & Dryg, a player might die.',
  },
  {
    id: 'rizzotherat',
    description: `If the player marked with the 'Chosen' reminder token was killed by the Demon tonight, wake Rizzo the Rat and show them an alive in-play character token. Remove the 'Chosen' reminder token.`,
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
    id: 'kuppbar',
    description: `The Kuppbar points to a player. Move the 'Drunk' token to the chosen player. That player is drunk.`,
  },
  {
    id: 'kamerer',
    description: `If the Kamerer died today or tonight: they choose a player. If the chosen player is a Townsfolk, the chosen player becomes a not-in-play Outsider.`,
  },
  {
    id: 'balettledare',
    description: `The Balettledare points to a player. Mark that player as 'Sober'. They are sober until dusk.`,
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
    id: 'longjohnsilver',
    description: `You may kill one of the players who voted for Long John Silver during the day (mark them with the 'Voted' reminder token after the vote).`,
  },
  {
    id: 'kermitthefrog',
    description: `Kermit the Frog points to a player (not themselves). If a Human was chosen, remove their 'Is Human' reminder token: the chosen player is now the Townsfolk they believe they are. Neither Kermit the Frog nor the chosen player learn this.\n\nIf Kermit the Frog has the 'Corrupted' reminder token and a Townsfolk was chosen, they might turn into a Human.`,
  },
  {
    id: 'drteeth',
    description: `If Dr. Teeth was killed by the Demon tonight, choose a player that is a Human and turn them into the Townsfolk they thought they were. Wake Dr. Teeth and point at the changed player. If there are no Humans in play, instead wake Dr. Teeth and shake your head no.`,
  },
  {
    id: 'samtheeagle',
    description:
      'Show fingers (1, 2, 3, etc.) equaling the distance from Sam the Eagle to any alive evil player.',
  },
  {
    id: 'camillathechicken',
    description: `(When a player is executed, mark them with the 'Executed today' reminder token.)\n\nIf a player died by execution today, wake Camilla the Chicken and point at a player who is the same alignment as the player who was executed. Remove any 'Executed today' reminder tokens.`,
  },
  {
    id: 'sweetums',
    description: `(Whenever an evil player votes for a nomination, mark them with an 'Evil voted' reminder token. If they vote on multiple executions, it still only counts as one.)\n\nShow Sweetums fingers equalling the number of 'Evil voted' tokens. Remove all 'Evil voted' reminder tokens from players.`,
  },
  {
    id: 'fozziebear',
    description: `(Each day, Fozzie Bear may make a public statement about the game in the form of a joke. These jokes do not have to be good, funny, nor verbal but MUST end with Fozzie Bear's classic catchphrase "Wocka! Wocka!". If Fozzie Bear's statement is true, place the 'True' reminder token next to them.)\n\nIf Fozzie Bear made a public joke today, wake them and nod your head if it was true, or shake your head if it was false. The truth value of the joke is determined when it was said, not during the night. (Although Fozzie Bear might still get wrong info if they are a Human during the night.)`,
  },
  {
    id: 'beaker',
    description: `(If Beaker is non-verbal during the first day, mark them with the 'Non-verbal' reminder token. Also do this with other non-verbal players.)\n\nIf Beaker is marked with the 'Non-verbal' reminder token, select up to 4 players who are also marked 'Non-verbal'. Wake Beaker and show them the chosen players' character tokens in addition to one not-in-play character token.`,
  },
  {
    id: 'swedishchef',
    description: `(If Swedish Chef is non-verbal during the first day, mark them with the 'Non-verbal' reminder token.)\n\nIf Swedish Chef is marked with the 'Non-verbal' reminder token, show them fingers (0, 1, 2, etc.) equalling the number of Humans in play. Otherwise, give a thumbs up if there are more Humans, thumbs down if there are less Humans, or a thumb to the side if there has been no change in the amount of Humans (compared to last night).`,
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
  {
    id: 'sweetheart',
    description:
      "If the Sweetheart died today: Choose a player and mark them with the 'Drunk' token; that player is drunk from now on.",
  },
  {
    id: 'prylprov',
    description: `Pryl & Prov points to a player. If a Minion is chosen: mark Pryl & Prov with the 'Drunk' token, they are drunk for the rest of the game. If an Outsider is chosen and an Outsider hasn't been chosen earlier: the chosen player becomes a not-in-play Townsfolk. Wake the chosen player to inform them of the change.`,
  },
  {
    id: 'medaljeri',
    description: `The Medaljeri points to a player. Mark that player with the 'Medal awarded' token. The marked player may use their ability tonight, even if dead.`,
  },
  {
    id: 'materialforvaltare',
    description:
      "If the Materialförvaltare has not used their ability: The Materialförvaltare either shakes their head 'no', or points to a player. If that player is a Townsfolk, they are now alive.",
  },
  {
    id: 'stamledare',
    description: `The Stämledare points to a player. Move the 'Forwarded' token to the chosen player. Whenever the marked player learns any info tonight due to their ability, also wake the Stämledare and show them the same info.`,
  },
  {
    id: 'trivselombud',
    description: `(Whenever an evil player chooses a player, mark them with the 'Chosen by evil' token.)\n\nPoint to each of the players marked with 'Chosen by evil'. Remove all 'Chosen by evil' tokens.`,
  },
  {
    id: 'bar',
    description:
      'Show the finger signal (0, 1, 2, etc.) for the number of currently drunk players.',
  },
  {
    id: 'arkivarie',
    description: `Show the character token of a player who died today or tonight.`,
  },
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
      "Point to a player with a different character type than the player marked with the 'Know' reminder token. Mark that player with the 'Know' reminder token.",
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
      'The Chambermaid points to two players. Show the number signal (0, 1, 2) for how many of those players wake tonight for their ability.',
  },
  {
    id: 'mathematician',
    description:
      'Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.',
  },
  {
    id: 'itk',
    description: `Show the finger signal (0, 1, 2, etc.) for the number of players who woke tonight due to their ability.`,
  },
  {
    id: 'leviathan',
    description: 'Change the Leviathan Day reminder for the next day.',
  },
] as const;

type StartOfGameAbility = ({
  players,
  playerId,
  playerIndex,
  scriptCharacters,
}: {
  players: BotcPlayers;
  playerId: number;
  playerIndex: number;
  scriptCharacters: CharacterId[];
}) => BotcPlayers;

export const START_OF_GAME_ABILITIES: Partial<
  Record<CharacterId, StartOfGameAbility>
> = {
  washerwoman: ({ players, playerId }) => {
    const knownPlayer = players.chooseRandom({
      characterType: 'townsfolk',
      excludeId: playerId,
    });
    if (!knownPlayer) {
      console.error(
        'No Townsfolk in player roster when setting up Washerwoman',
      );
      return players;
    }
    knownPlayer.reminders.push({
      characterId: 'washerwoman',
      message: 'Townsfolk',
    });

    const wrongPlayer = players.chooseRandom({
      excludeIds: [playerId, knownPlayer.id],
    });
    if (!wrongPlayer) {
      console.error('No other players in roster when setting up Washerwoman');
      return players;
    }
    wrongPlayer.reminders.push({
      characterId: 'washerwoman',
      message: 'Wrong',
    });

    return players;
  },

  librarian: ({ players, playerId }) => {
    const knownPlayer = players.chooseRandom({
      characterType: 'outsiders',
      excludeId: playerId,
    });
    if (!knownPlayer) {
      console.warn('No Outsider in player roster when setting up Librarian');
      return players;
    }
    knownPlayer.reminders.push({
      characterId: 'librarian',
      message: 'Outsider',
    });

    const wrongPlayer = players.chooseRandom({
      excludeIds: [playerId, knownPlayer.id],
    });
    if (!wrongPlayer) {
      console.error('No other players in roster when setting up Librarian');
      return players;
    }
    wrongPlayer.reminders.push({
      characterId: 'librarian',
      message: 'Wrong',
    });

    return players;
  },

  investigator: ({ players, playerId }) => {
    const knownPlayer = players.chooseRandom({
      characterType: 'minions',
      excludeId: playerId,
    });
    if (!knownPlayer) {
      console.warn('No Minion in player roster when setting up Investigator');
      return players;
    }
    knownPlayer.reminders.push({
      characterId: 'investigator',
      message: 'Minion',
    });

    const wrongPlayer = players.chooseRandom({
      excludeIds: [playerId, knownPlayer.id],
    });
    if (!wrongPlayer) {
      console.error('No other players in roster when setting up Investigator');
      return players;
    }
    wrongPlayer.reminders.push({
      characterId: 'investigator',
      message: 'Wrong',
    });

    return players;
  },

  fortuneteller: ({ players, playerId }) => {
    const redHerring = players.chooseRandom({
      alignment: 'good',
      excludeId: playerId,
    });
    if (!redHerring) {
      console.error(
        'No other Good players in roster when setting up Fortune Teller',
      );
      return players;
    }
    redHerring.reminders.push({
      characterId: 'fortuneteller',
      message: 'Red herring',
    });
    return players;
  },

  grandmother: ({ players, playerId }) => {
    const grandchild = players.chooseRandom({
      alignment: 'good',
      excludeId: playerId,
    });
    if (!grandchild) {
      console.error('No other Good player found when setting up Grandmother');
      return players;
    }
    grandchild.reminders.push({
      characterId: 'grandmother',
      message: 'Grandchild',
    });

    return players;
  },

  eviltwin: ({ players, playerId }) => {
    const twin = players.chooseRandom({
      alignment: 'good',
      excludeId: playerId,
    });
    if (!twin) {
      console.error('No opposing player found when setting up Evil Twin');
      return players;
    }
    twin.reminders.push({ characterId: 'eviltwin', message: 'Twin' });

    return players;
  },

  nodashii: ({ players, playerIndex }) => {
    for (
      let i = (playerIndex + 1) % players.length;
      i !== playerIndex;
      i = (i + 1) % players.length
    ) {
      const player = players[i];
      if (!player) {
        console.error(
          `Out of boundaries error (with index ${i}, increasing) when setting up No Dashii (this shouldn't happen as boundaries are checked in a for loop)`,
        );
        return players;
      }
      if (player.isCharacterType('townsfolk')) {
        player.reminders.push({ characterId: 'nodashii', message: 'Poisoned' });
        break;
      }
    }
    for (
      let i = (playerIndex + (players.length - 1)) % players.length;
      i !== playerIndex;
      i = (i + (players.length - 1)) % players.length
    ) {
      const player = players[i];
      if (!player) {
        console.error(
          `Out of boundaries error (with index ${i}, decreasing) when setting up No Dashii (this shouldn't happen as boundaries are checked in a for loop)`,
        );
        return players;
      }
      if (player.isCharacterType('townsfolk')) {
        player.reminders.push({ characterId: 'nodashii', message: 'Poisoned' });
        break;
      }
    }
    return players;
  },

  sculptor: ({ players, playerId }) => {
    const sculpture = players.chooseRandom({ excludeId: playerId });
    if (!sculpture) {
      console.error(
        'No other player found when setting up Sculpture for Sculptor',
      );
      return players;
    }
    sculpture.reminders.push({ characterId: 'sculptor', message: 'Sculpture' });

    return players;
  },

  vestalvirgin: ({ players, playerId }) => {
    const learns = players.chooseRandom({ excludeId: playerId });
    if (!learns) {
      console.error('No other player found when setting up Vestal Virgin');
      return players;
    }
    learns.reminders.push({ characterId: 'vestalvirgin', message: 'Learns' });

    return players;
  },

  winemaker: ({ players, playerIndex }) => {
    const winemaker = players[playerIndex];
    if (!winemaker) {
      console.error("Couldn't find Winemaker when setting up Winemaker");
      return players;
    }
    const reminderText = Math.random() < 0.5 ? 'Odd' : 'Even';
    winemaker.reminders.push({
      characterId: 'winemaker',
      message: reminderText,
    });

    if (reminderText === 'Odd') {
      for (
        let i = (playerIndex + 1) % players.length;
        i !== playerIndex;
        i = (i + 1) % players.length
      ) {
        const player = players[i];
        if (!player) {
          console.error(
            `Out of boundaries error (with index ${i}, increasing) when setting up Winemaker (this shouldn't happen as boundaries are checked in a for loop)`,
          );
          return players;
        }
        if (player.isCharacterType('townsfolk')) {
          player.reminders.push({
            characterId: 'winemaker',
            message: 'Drunk',
          });
          break;
        }
      }
      for (
        let i = (playerIndex + (players.length - 1)) % players.length;
        i !== playerIndex;
        i = (i + (players.length - 1)) % players.length
      ) {
        const player = players[i];
        if (!player) {
          console.error(
            `Out of boundaries error (with index ${i}, decreasing) when setting up Winemaker (this shouldn't happen as boundaries are checked in a for loop)`,
          );
          return players;
        }
        if (player.isCharacterType('townsfolk')) {
          player.reminders.push({
            characterId: 'winemaker',
            message: 'Drunk',
          });
          break;
        }
      }
    }

    return players;
  },

  widow: ({ players }) => {
    const player = players.chooseRandom({ alignment: 'good' });
    if (!player) {
      console.error(`No good player found when setting up Widow.`);
      return players;
    }
    player.reminders.push({ characterId: 'widow', message: 'Know' });
    return players;
  },

  rowlfthedog: ({ players }) => {
    for (const player of players.chooseRandomMultiple(2, {
      characterTypes: ['outsiders', 'minions', 'demons'],
    })) {
      player.reminders.push({
        characterId: 'rowlfthedog',
        message: 'Not Townsfolk',
      });
    }
    return players;
  },

  samtheeagle: ({ players }) => {
    const human = players.chooseRandom({ characterTypes: ['townsfolk'] });
    if (!human) {
      console.error(`No Townsfolk player found when setting up Sam the Eagle.`);
      return players;
    }
    human.reminders.push({ characterId: 'samtheeagle', message: 'Is Human' });
    return players;
  },

  misspiggy: ({ players }) => {
    for (const player of players) {
      if (player.characterId === 'kermitthefrog') {
        player.reminders.push({
          characterId: 'misspiggy',
          message: 'Corrupted',
        });
        break;
      }
    }
    return players;
  },
};

export const CHARACTERS = Object.entries(_characters).reduce(
  (acc, [id, val]) => {
    const firstNightReminderIndex = FIRST_NIGHT_TEXT.findIndex(
      (r) => r.id === id,
    );
    const otherNightReminderIndex = OTHER_NIGHTS_TEXT.findIndex(
      (r) => r.id === id,
    );
    const firstNightReminder = FIRST_NIGHT_TEXT[firstNightReminderIndex];
    const otherNightReminder = OTHER_NIGHTS_TEXT[otherNightReminderIndex];
    const nightReminders: BotcCharacter['nightReminders'] = {
      first: firstNightReminder
        ? {
            text: firstNightReminder.description,
            index: firstNightReminderIndex,
          }
        : undefined,
      other: otherNightReminder
        ? {
            text: otherNightReminder.description,
            index: otherNightReminderIndex,
          }
        : undefined,
    };
    const imgPath = getImagePathFromId(id as CharacterId);
    acc[id as CharacterId] = {
      ...val,
      id: id as CharacterId,
      team: getType(id as CharacterId),
      image: [imgPath, imgPath],
      nightReminders,
    };
    return acc;
  },
  {} as Record<CharacterId, BotcCharacter>,
);

export const getWikiLink = (id: CharacterId) =>
  isFallOfRomeCharacter(id)
    ? `https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/almanac.html#${id}_fall_of_rome`
    : isMuppetsOnAClocktowerCharacter(id)
    ? null
    : isMurderOnTheDancefloorCharacter(id)
    ? null
    : `https://wiki.bloodontheclocktower.com/${encodeURIComponent(
        CHARACTERS[id].name.replaceAll(' ', '_'),
      )}`;

const checkDroisoned = (reminder: Reminder) => {
  const text = reminder.message.toLowerCase();
  return (
    text.includes('drunk') ||
    text.includes('poisoned') ||
    text.includes('is human') ||
    text.includes('gammal & dryg')
  );
};
export const isDroisoned = (player: BotcPlayer) =>
  (player.reminders.find(checkDroisoned) ??
    player.automaticReminders.find(checkDroisoned)) !== undefined;

export const isGlobalDroisoned = (
  characterType: CharacterType,
  players: BotcPlayer[],
) => {
  const reminders = players.flatMap((player) =>
    player.reminders.concat(player.automaticReminders),
  );

  return (
    reminders.find((reminder) => {
      const msg = reminder.message.toLowerCase();
      return (
        (msg.includes(characterType) || msg.includes('everyone')) &&
        (msg.includes('drunk') || msg.includes('poisoned'))
      );
    }) !== undefined
  );
};

const JINXES: Partial<
  Record<CharacterId, Partial<Record<CharacterId, { description: string }>>>
> = {
  alchemist: {
    boffin: {
      description:
        'If the Alchemist has the Boffin ability, the Alchemist does not learn what ability the Demon has.',
    },
    marionette: {
      description:
        'An Alchemist-Marionette has no Marionette ability & the Marionette is in play.',
    },
    mastermind: {
      description:
        'An Alchemist-Mastermind has no Mastermind ability & the Mastermind is not-in-play.',
    },
    organgrinder: {
      description:
        'If the Alchemist has the Organ Grinder ability, the Organ Grinder is in play. If both are sober, both are drunk.',
    },
    spy: {
      description:
        'An Alchemist-Spy has no Spy ability & a Spy is in play. After each execution, a living Alchemist-Spy may publicly guess a living player as the Spy. If correct, the Demon must choose the Spy tonight.',
    },
    summoner: {
      description:
        'The Alchemist-Summoner does not get bluffs, and chooses which Demon but not which player. If they die before this happens, evil wins. [No Demon]',
    },
    wraith: {
      description:
        'An Alchemist-Wraith has no Wraith ability & a Wraith is in play. After each execution, a living Alchemist-Wraith may publicly guess a living player as the Wraith. If correct, the Demon must choose the Wraith tonight.',
    },
    widow: {
      description:
        'An Alchemist-Widow has no Widow ability & a Widow is in play. After each execution, a living Alchemist-Widow may publicly guess a living player as the Widow. If correct, the Demon must choose the Widow tonight.',
    },
  },
  bountyhunter: {
    kazali: {
      description:
        'If the Kazali turns the Bounty Hunter into a Minion, an evil Townsfolk is not created.',
    },
    philosopher: {
      description:
        'If the Philosopher gains the Bounty Hunter ability, a Townsfolk might turn evil.',
    },
  },
  cannibal: {
    butler: {
      description:
        'If the Cannibal gains the Butler ability, the Cannibal learns this.',
    },
    juggler: {
      description:
        'If the Juggler guesses on their first day and dies by execution, tonight the living Cannibal learns how many guesses the Juggler got correct.',
    },
    princess: {
      description:
        'If the Cannibal nominated, executed, & killed the Princess today, the Demon doesn’t kill tonight.',
    },
    zealot: {
      description:
        'If the Cannibal gains the Zealot ability, the Cannibal learns this.',
    },
  },
  mathematician: {
    chambermaid: {
      description:
        'The Chambermaid can detect if the Mathematician will wake tonight.',
    },
    drunk: {
      description:
        'The Mathematician learns if the Drunk’s ability yielded false info or failed to work properly.',
    },
    lunatic: {
      description:
        'The Mathematician learns if the Lunatic attacks a different player than the real Demon attacked.',
    },
    marionette: {
      description:
        "The Mathematician learns if the Marionette's ability yielded false info or failed to work properly.",
    },
  },
  magician: {
    legion: {
      description:
        'TIf the Magician is in play, during the Demon info step, Legion wake in separate groups. Each group learns which players are good, but does not learn the Magician.',
    },
    marionette: {
      description:
        "If the Magician is alive, the Demon doesn't know which neighbor is the Marionette.",
    },
    spy: {
      description:
        "When the Spy sees the Grimoire, the Demon and Magician's character tokens are removed.",
    },
    vizier: {
      description:
        "If the Vizier is in play, the Magician has no ability but is immune to the Vizier's ability.",
    },
    widow: {
      description:
        "When the Widow sees the Grimoire, the Demon and Magician's character tokens are removed.",
    },
    wraith: {
      description:
        'After each execution, the living Magician may publicly guess a living player as the Wraith. If correct, the Demon must choose the Wraith tonight.',
    },
  },
  butler: {
    organgrinder: {
      description:
        'If the Organ Grinder is causing eyes closed voting, the Butler may raise their hand to vote but their vote is only counted if their master voted too.',
    },
  },
  heretic: {
    baron: {
      description: 'Only 1 jinxed character can be in play.',
    },
    godfather: {
      description: 'Only 1 jinxed character can be in play.',
    },
    lleech: {
      description: 'Only 1 jinxed character can be in play.',
    },
    pithag: {
      description: 'Only 1 jinxed character can be in play.',
    },
    spy: {
      description: 'Only 1 jinxed character can be in play.',
    },
    widow: {
      description: 'Only 1 jinxed character can be in play.',
    },
  },
  plaguedoctor: {
    baron: {
      description:
        'If the Storyteller would gain the Baron ability, up to two players become Outsiders.',
    },
    boomdandy: {
      description:
        'If the Storyteller would gain the Boomdandy ability, a player becomes the Boomdandy.',
    },
    eviltwin: {
      description:
        'If the Storyteller would gain the Evil Twin ability, a player becomes the Evil Twin.',
    },
    fearmonger: {
      description:
        'If the Storyteller would gain the Fearmonger ability, a Minion gains it, and learns this.',
    },
    goblin: {
      description:
        'If the Storyteller would gain the Goblin ability, a Minion gains it, and learns this.',
    },
    marionette: {
      description:
        "If the Storyteller would gain the Marionette ability, one of the Demon's good neighbors becomes the Marionette.",
    },
    scarletwoman: {
      description:
        'If the Storyteller would gain the Scarlet Woman ability, a Minion gains it, and learns this.',
    },
    spy: {
      description:
        'If the Storyteller would gain the Spy ability, a Minion gains it, and learns this.',
    },
    wraith: {
      description:
        'If the Storyteller would gain the Wraith ability, a Minion gains it, and learns this.',
    },
  },
  recluse: {
    ogre: {
      description:
        'If the Recluse registers as evil to the Ogre, the Ogre learns that they are evil.',
    },
    sage: {
      description: 'The Recluse might register as the Demon to the Sage.',
    },
  },
  boffin: {
    cultleader: {
      description:
        'If the Demon has the Cult Leader ability, they can’t turn good due to this ability.',
    },
    drunk: {
      description: 'The Demon cannot have the Drunk ability.',
    },
    goon: {
      description:
        'If the Demon has the Goon ability, they can’t turn good due to this ability.',
    },
    heretic: {
      description: 'The Demon cannot have the Heretic ability.',
    },
    ogre: {
      description: 'The Demon cannot have the Ogre ability.',
    },
    politician: {
      description: 'The Demon cannot have the Politician ability.',
    },
    villageidiot: {
      description:
        'If there is a spare token, the Boffin can give the Demon the Village Idiot ability.',
    },
  },
  cerenovus: {
    goblin: {
      description:
        'The Cerenovus may choose to make a player mad that they are the Goblin.',
    },
  },
  marionette: {
    balloonist: {
      description:
        'If the Marionette thinks that they are the Balloonist, an Outsider might have been added during setup.',
    },
    huntsman: {
      description:
        'If the Marionette thinks that they are the Huntsman, the Damsel was added during setup.',
    },
    kazali: {
      description:
        'If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor.',
    },
    lilmonsta: {
      description:
        'If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor.',
    },
    summoner: {
      description:
        'If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor.',
    },
  },
  mastermind: {
    vigormortis: {
      description:
        'A Mastermind that has their ability keeps it if the Vigormortis dies.',
    },
  },
  pithag: {
    cultleader: {
      description:
        "If the Pit-Hag turns an evil player into the Cult Leader, they can't turn good due to their own ability.",
    },
    damsel: {
      description:
        'If a Pit-Hag creates a Damsel, the Storyteller chooses which player it is.',
    },
    goon: {
      description:
        "If the Pit-Hag turns an evil player into the Goon, they can't turn good due to their own ability.",
    },
    ogre: {
      description:
        "If the Pit-Hag turns an evil player into the Ogre, they can't turn good due to their own ability.",
    },
    politician: {
      description:
        "If the Pit-Hag turns an evil player into the Politician, they can't turn good due to their own ability.",
    },
    villageidiot: {
      description:
        'If there is a spare token, the Pit-Hag can create an extra Village Idiot. If so, the drunk Village Idiot might change.',
    },
  },
  scarletwoman: {
    alhadikhia: {
      description:
        'If there would be two Demons, one of which was the Scarlet Woman, the Scarlet Woman becomes the Scarlet Woman again.',
    },
    fanggu: {
      description:
        'If there would be two Demons, one of which was the Scarlet Woman, the Scarlet Woman remains the Scarlet Woman.',
    },
  },
  spy: {
    damsel: {
      description:
        'If the Spy is (or has been) in play, the Damsel is poisoned.',
    },
    ogre: {
      description: 'The Spy registers as evil to the Ogre.',
    },
    poppygrower: {
      description:
        'If the Poppy Grower has their ability, the Spy does not see the Grimoire.',
    },
  },
  summoner: {
    clockmaker: {
      description: 'The Summoner registers as the Demon to the Clockmaker.',
    },
    courtier: {
      description:
        'If the living Summoner has no ability, the Storyteller has the Summoner ability.',
    },
    engineer: {
      description:
        'If the living Summoner is removed from play, the Storyteller has the Summoner ability.',
    },
    hatter: {
      description:
        'If the Summoner creates a second living Demon, deaths tonight are arbitrary.',
    },
    kazali: {
      description:
        'If the Summoner creates a second living Demon, deaths tonight are arbitrary.',
    },
    lordoftyphon: {
      description:
        'If a Lord of Typhon is summoned, they must neighbor a Minion & their other neighbor becomes an evil Minion.',
    },
    pithag: {
      description:
        'If the Summoner creates a second living Demon, deaths tonight are arbitrary.',
    },
    poppygrower: {
      description:
        'If the Poppy Grower is alive on the 3rd night, the Summoner chooses which Demon but not which player.',
    },
    preacher: {
      description:
        'If the living Summoner has no ability, the Storyteller has the Summoner ability.',
    },
    pukka: {
      description:
        'The Summoner may summon a Pukka on the 2nd night instead of the 3rd.',
    },
    zombuul: {
      description:
        'If the Summoner summons a dead player into the Zombuul, the Zombuul has already "died once".',
    },
  },
  vizier: {
    alsaahir: {
      description: "The Storyteller doesn't declare the Vizier is in play.",
    },
    courtier: {
      description:
        'If the Vizier loses their ability, they learn this, and cannot die during the day.',
    },
    fearmonger: {
      description:
        'The Vizier wakes with the Fearmonger, learns who they choose and cannot choose to immediately execute that player.',
    },
    investigator: {
      description: "The Storyteller doesn't declare the Vizier is in play.",
    },
    politician: {
      description: 'The Politician might register as evil to the Vizier.',
    },
    preacher: {
      description:
        'If the Vizier loses their ability, they learn this, and cannot die during the day.',
    },
    zealot: {
      description: 'The Zealot might register as evil to the Vizier.',
    },
  },
  widow: {
    damsel: {
      description:
        'If the Widow is (or has been) in play, the Damsel is poisoned.',
    },
    poppygrower: {
      description:
        'If the Poppy Grower has their ability, the Widow does not see the Grimoire.',
    },
  },
  alhadikhia: {
    princess: {
      description:
        'If the Princess nominated & executed a player on their 1st day, no one dies to the Al-Hadikhia tonight.',
    },
    mastermind: {
      description:
        'If the Al-Hadikhia dies by execution, and the Mastermind is alive, the Al-Hadikhia chooses 3 good players tonight: if all 3 choose to live, evil wins. Otherwise, good wins.',
    },
  },
  legion: {
    engineer: {
      description:
        'If Legion is created, all evil players become Legion. If Legion is in play, the Engineer starts knowing this but has no ability.',
    },
    hatter: {
      description:
        'If Legion is created, all evil players become Legion. If Legion is in play, the Hatter has no ability.',
    },
    minstrel: {
      description:
        'If Legion died by execution today, Legion keeps their ability, but the Minstrel might learn they are Legion.',
    },
    politician: {
      description: 'The Politician might register as evil to Legion.',
    },
    preacher: {
      description:
        'If the Preacher chooses Legion, Legion keeps their ability, but the Preacher might learn they are Legion.',
    },
    summoner: {
      description: 'If Legion is summoned, all evil players become Legion.',
    },
    zealot: {
      description: 'The Zealot might register as evil to Legion.',
    },
  },
  leviathan: {
    banshee: {
      description:
        'Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Banshee dies & gains their ability.',
    },
    exorcist: {
      description:
        'If the Leviathan nominates and executes the Exorcist-chosen player, good wins.',
    },
    farmer: {
      description:
        'Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Farmer uses their ability but does not die.',
    },
    grandmother: {
      description:
        'If the Leviathan is in play and the Grandchild dies by execution, evil wins.',
    },
    hatter: {
      description: 'The Leviathan cannot enter play after day 5.',
    },
    innkeeper: {
      description:
        'If the Leviathan nominates and executes an Innkeeper-protected player, good wins.',
    },
    king: {
      description:
        'If the Leviathan is in play, and at least 1 player is dead, the King learns an alive character each night.',
    },
    mayor: {
      description:
        'If the Leviathan and the Mayor are alive on day 5 & no execution occurs, good wins.',
    },
    monk: {
      description:
        'If the Leviathan nominates and executes the Monk-protected player, good wins.',
    },
    pithag: {
      description: 'The Leviathan cannot enter play after day 5.',
    },
    ravenkeeper: {
      description:
        'Each night*, the Leviathan chooses an alive player (different to previous nights): a chosen Ravenkeeper uses their ability but does not die.',
    },
    sage: {
      description:
        'Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die.',
    },
    soldier: {
      description:
        'If the Leviathan nominates and executes the Soldier, good wins.',
    },
  },
  lilmonsta: {
    hatter: {
      description:
        "If the Hatter dies & the Demon chooses Lil' Monsta, they also choose a Minion to become.",
    },
    poppygrower: {
      description:
        "If Lil' Monsta & the Poppy Grower are alive, Minions wake one by one, until one of them chooses to take the Lil' Monsta token.",
    },
    psychopath: {
      description:
        "If the Psychopath is babysitting Lil' Monsta, they die when executed.",
    },
    magician: {
      description:
        "If the Magician is alive, the Storyteller chooses which Minion babysits Lil' Monsta.",
    },
    scarletwoman: {
      description:
        "If Lil' Monsta dies with 5 or more players alive, the Scarlet Woman babysits Lil' Monsta for the rest of the game.",
    },
    vizier: {
      description:
        "If the Vizier is babysitting Lil' Monsta, they die when executed.",
    },
  },
  lleech: {
    mastermind: {
      description:
        'If the Mastermind is alive and the Lleech host dies by execution, the Lleech lives but loses their ability.',
    },
    slayer: {
      description: 'If the Slayer slays the Lleech host, the host dies.',
    },
  },
  riot: {
    atheist: {
      description:
        'During a riot, if the Storyteller is nominated, players vote. If they are "about to die", the game ends. If not, they nominate again.',
    },
    banshee: {
      description:
        'Each night*, Riot chooses an alive good player (different to previous nights): a chosen Banshee dies & gains their ability.',
    },
    exorcist: {
      description:
        'If Riot nominates and executes the Exorcist-chosen player, good wins.',
    },
    farmer: {
      description:
        'Each night*, Riot chooses an alive good player (different to previous nights): a chosen Farmer uses their ability but does not die.',
    },
    grandmother: {
      description:
        'If Riot is in play and the Grandchild dies by execution, evil wins.',
    },
    innkeeper: {
      description:
        'If Riot nominates and executes an Innkeeper-protected player, good wins.',
    },
    king: {
      description:
        'If Riot is in play, and at least 1 player is dead, the King learns an alive character each night.',
    },
    mayor: {
      description:
        'The Mayor may choose to stop the riot. If they do so when only 1 Riot is alive, good wins. Otherwise, evil wins.',
    },
    monk: {
      description:
        'If Riot nominates and executes the Monk-protected player, good wins.',
    },
    ravenkeeper: {
      description:
        'Each night*, Riot chooses an alive good player (different to previous nights): a chosen Ravenkeeper uses their ability but does not die.',
    },
    sage: {
      description:
        'Each night*, Riot chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die.',
    },
    soldier: {
      description: 'If Riot nominates and executes the Soldier, good wins.',
    },
  },
  vortox: {
    banshee: {
      description:
        'If the Vortox kills the Banshee, all players learn that the Banshee has died.',
    },
  },
  yaggababble: {
    exorcist: {
      description:
        'If the Exorcist chooses the Yaggababble, the Yaggababble does not kill tonight.',
    },
  },
};

export const getJinxes = (characterIds: CharacterId[]) => {
  const result: [[CharacterId, CharacterId], { description: string }][] = [];
  for (const characterId of characterIds) {
    const possibleJinxes = JINXES[characterId];
    if (!possibleJinxes) {
      continue;
    }
    for (const jinxId of characterIds) {
      const jinx = possibleJinxes[jinxId];
      if (!jinx) {
        continue;
      }
      result.push([[characterId, jinxId], jinx]);
    }
  }
  return result;
};

const CHARACTER_TYPE_ORDER: CharacterType[] = [
  'townsfolk',
  'outsiders',
  'minions',
  'demons',
  'travellers',
];
const getCharacterTypeIndex = (t: CharacterType) => {
  const idx = CHARACTER_TYPE_ORDER.findIndex(
    (characterType) => characterType === t,
  );
  return idx === -1 ? 0x516 : idx;
};

const ABILITY_TEXT_ORDER: string[] = [
  'You start knowing',
  'At night',
  'Each dusk*',
  'Each night',
  'Each night*',
  'Each day',
  'Once per game, at night',
  'Once per game, at night*',
  'Once per game, during the day',
  'Once per game',
  'On your 1st night',
  'On your 1st day',
  'You think',
  'You are',
  'You have',
  'You do not know',
  'You might',
  'You',
  'When you die',
  'When you learn that you died',
  'When',
  'If you die',
  'If you died',
  'If you are “mad”',
  `If you are "mad"`,
  `If you are 'mad'`,
  'If you are mad',
  'If you',
  'If the Demon dies',
  'If the Demon kills',
  'If the Demon',
  'If both',
  'If there are 5 or more players alive',
  'If',
  'All players',
  'All',
  'The 1st time',
  'The',
  'Good',
  'Evil',
  'Players',
  'Minions',
];
const getAbilityTextIndex = (abilityText: string) => {
  const idx = ABILITY_TEXT_ORDER.findIndex((abilityType) =>
    abilityText.includes(abilityType),
  );
  return idx === -1 ? 0x516 : idx;
};

export const sortByStandardSortOrder = (a: CharacterId, b: CharacterId) => {
  // Standard sort order is defined at https://bloodontheclocktower.com/blogs/news/sort-order-sao-update
  const aCharacter = CHARACTERS[a];
  const bCharacter = CHARACTERS[b];

  if (aCharacter.team !== bCharacter.team) {
    return (
      getCharacterTypeIndex(aCharacter.team) -
      getCharacterTypeIndex(bCharacter.team)
    );
  }
  const aAbilityIndex = getAbilityTextIndex(aCharacter.description);
  const bAbilityIndex = getAbilityTextIndex(bCharacter.description);

  if (aAbilityIndex !== bAbilityIndex) {
    return aAbilityIndex - bAbilityIndex;
  }

  // If abilities are in the same ability description group, sort by ability description length, then character name length, then sort character name alphabetically
  else if (aCharacter.description.length !== bCharacter.description.length) {
    return aCharacter.description.length - bCharacter.description.length;
  } else if (aCharacter.name.length !== bCharacter.name.length) {
    return aCharacter.name.length - bCharacter.name.length;
  } else {
    return aCharacter.name.localeCompare(bCharacter.name, 'en');
  }
};
