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
  id: EditionID;
  name: string;
  townsfolk: CharacterID[];
  outsiders: CharacterID[];
  minions: CharacterID[];
  demons: CharacterID[];
  travellers: CharacterID[];
}

export const EDITIONS: [Edition, Edition, Edition] = [
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
    outsiders: [
      'butler',
      'drunk',
      'recluse',
      'saint',
    ],
    minions: [
      'poisoner',
      'spy',
      'scarletwoman',
      'baron',
    ],
    demons: [
      'imp',
    ],
    travellers: [
      'bureaucrat',
      'thief',
      'gunslinger',
      'scapegoat',
      'beggar',
    ],
  }, {
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
    outsiders: [
      'tinker',
      'moonchild',
      'goon',
      'lunatic',
    ],
    minions: [
      'godfather',
      'devilsadvocate',
      'assassin',
      'mastermind',
    ],
    demons: [
      'zombuul',
      'pukka',
      'shabaloth',
      'po',
    ],
    travellers: [
      'apprentice',
      'matron',
      'judge',
      'bishop',
      'voudon',
    ],
  }, {
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
    outsiders: [
      'mutant',
      'sweetheart',
      'barber',
      'klutz',
    ],
    minions: [
      'eviltwin',
      'witch',
      'cerenovus',
      'pithag',
    ],
    demons: [
      'fanggu',
      'vigormortis',
      'nodashii',
      'vortox',
    ],
    travellers: [
      'barista',
      'harlot',
      'butcher',
      'bonecollector',
      'deviant',
    ],
  },
] as const;

export const EDITION_IDS = [
  'trouble-brewing',
  'bad-moon-rising',
  'sects-and-violets',
  'custom',
]
export type EditionID = (typeof EDITION_IDS)[number]

export interface BOTCCharacter {
  id: CharacterID;
  name: string;
  description: string;
}

const _characters = {
  // Trouble Brewing - Townsfolk
  washerwoman: {
    name: 'Washerwoman',
    description:
      'You start knowing that 1 of 2 players is a particular Townsfolk.',
  },
  librarian: {
    name: 'Librarian',
    description:
      'You start knowing that 1 of 2 players is a particular Outsider.',
  },
  investigator: {
    name: 'Investigator',
    description:
      'You start knowing that 1 of 2 players is a particular Minion.',
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
  },
  undertaker: {
    name: 'Undertaker',
    description:
      'Each night*, you learn which character died by execution today.',
  },
  monk: {
    name: 'Monk',
    description:
      'Each night*, choose a player (not yourself): they are safe from the Demon tonight.',
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
  },
  slayer: {
    name: 'Slayer',
    description:
      'Once per game, during the day, publicly choose a player: if they are the Demon, they die.',
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
  },

  // Trouble Brewing - Travelers
  bureaucrat: {
    name: 'Bureaucrat',
    description: 'Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.',
  },
  thief: {
    name: 'Thief',
    description: 'Each night, choose a player (not yourself): their vote counts negatively tomorrow.',
  },
  gunslinger: {
    name: 'Gunslinger',
    description: 'Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.',
  },
  scapegoat: {
    name: 'Scapegoat',
    description: 'If a player of your alignment is executed, you might be executed instead.',
  },
  beggar: {
    name: 'Beggar',
    description: 'You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober & healthy.',
  },

  // Bad Moon Rising - Townsfolk
  grandmother: {
    name: 'Grandmother',
    description: 'You start knowing a good player & their character. If the Demon kills them, you die too.',
  },
  sailor: {
    name: 'Sailor',
    description: "Each night, choose an alive player: either you or they are drunk until dusk. You can't die.",
  },
  chambermaid: {
    name: 'Chambermaid',
    description: 'Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.',
  },
  exorcist: {
    name: 'Exorcist',
    description: "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight.",
  },
  innkeeper: {
    name: 'Innkeeper',
    description: "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk.",
  },
  gambler: {
    name: 'Gambler',
    description: 'Each night*, choose a player & guess their character: if you guess wrong, you die.',
  },
  gossip: {
    name: 'Gossip',
    description: 'Each day, you may make a public statement. Tonight, if it was true, a player dies.',
  },
  courtier: {
    name: 'Courtier',
    description: 'Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.',
  },
  professor: {
    name: 'Professor',
    description: 'Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.',
  },
  minstrel: {
    name: 'Minstrel',
    description: 'When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.',
  },
  tealady: {
    name: 'Tea Lady',
    description: "If both your alive neighbors are good, they can't die.",
  },
  pacifist: {
    name: 'Pacifist',
    description: 'Executed good players might not die.',
  },
  fool: {
    name: 'Fool',
    description: "The 1st time you die, you don't.",
  },

  // Bad Moon Rising - Outsiders
  tinker: {
    name: 'Tinker',
    description: "You might die at any time.",
  },
  moonchild: {
    name: 'Moonchild',
    description: "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.",
  },
  goon: {
    name: 'Goon',
    description: "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.",
  },
  lunatic: {
    name: 'Lunatic',
    description: "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.",
  },

  // Bad Moon Rising - Minions
  godfather: {
    name: 'Godfather',
    description: "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]",
  },
  devilsadvocate: {
    name: "Devil's Advocate",
    description: "Each night, choose a living player (different to last night): if executed tomorrow, they don't die.",
  },
  assassin: {
    name: 'Assassin',
    description: "Once per game, at night*, choose a player: they die, even if for some reason they could not.",
  },
  mastermind: {
    name: 'Mastermind',
    description: "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.",
  },

  // Bad Moon Rising - Demons
  zombuul: {
    name: 'Zombuul',
    description: "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.",
  },
  pukka: {
    name: 'Pukka',
    description: "Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.",
  },
  shabaloth: {
    name: 'Shabaloth',
    description: "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.",
  },
  po: {
    name: 'Po',
    description: "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.",
  },

  // Bad Moon Rising - Travellers
  apprentice: {
    name: 'Apprentice',
    description: "On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil).",
  },
  matron: {
    name: 'Matron',
    description: "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.",
  },
  judge: {
    name: 'Judge',
    description: "Once per game, if another player nominated, you may choose to force the current execution to pass or fail.",
  },
  bishop: {
    name: 'Bishop',
    description: "Only the Storyteller can nominate. At least 1 opposing player must be nominated each day.",
  },
  voudon: {
    name: 'Voudon',
    description: "Only you & the dead can vote. They don't need a vote token to do so. A 50% majority isn't required.",
  },

  // Sects and Violets - Townsfolk
  clockmaker: {
    name: 'Clockmaker',
    description: "You start knowing how many steps from the Demon to its nearest Minion.",
  },
  dreamer: {
    name: 'Dreamer',
    description: "Each night, choose a player (not yourself or Travellers): you learn 1 good & 1 evil character, 1 of which is correct.",
  },
  snakecharmer: {
    name: 'Snake Charmer',
    description: "Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.",
  },
  mathematician: {
    name: 'Mathematician',
    description: "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability.",
  },
  flowergirl: {
    name: 'Flowergirl',
    description: "Each night*, you learn if a Demon voted today.",
  },
  towncrier: {
    name: 'Town Crier',
    description: "Each night*, you learn if a Minion nominated today.",
  },
  oracle: {
    name: 'Oracle',
    description: "Each night*, you learn how many dead players are evil.",
  },
  savant: {
    name: 'Savant',
    description: "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.",
  },
  seamstress: {
    name: 'Seamstress',
    description: "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment.",
  },
  philosopher: {
    name: 'Philosopher',
    description: "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk.",
  },
  artist: {
    name: 'Artist',
    description: "Once per game, during the day, privately ask the Storyteller any yes/no question.",
  },
  juggler: {
    name: 'Juggler',
    description: "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct.",
  },
  sage: {
    name: 'Sage',
    description: "If the Demon kills you, you learn that it is 1 of 2 players.",
  },

  // Sects and Violets - Outsiders
  mutant: {
    name: 'Mutant',
    description: "If you are “mad” about being an Outsider, you might be executed.",
  },
  sweetheart: {
    name: 'Sweetheart',
    description: "When you die, 1 player is drunk from now on.",
  },
  barber: {
    name: 'Barber',
    description: "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.",
  },
  klutz: {
    name: 'Klutz',
    description: "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.",
  },

  // Sects and Violets - Minions
  eviltwin: {
    name: 'Evil Twin',
    description: "You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live.",
  },
  witch: {
    name: 'Witch',
    description: "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.",
  },
  cerenovus: {
    name: 'Cerenovus',
    description: "Each night, choose a player & a good character: they are “mad” they are this character tomorrow, or might be executed.",
  },
  pithag: {
    name: 'Pit-Hag',
    description: "Each night*, choose a player & a character they become (if not in play). If a Demon is made, deaths tonight are arbitrary.",
  },

  // Sects and Violets - Demons
  fanggu: {
    name: 'Fang Gu',
    description: "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]",
  },
  vigormortis: {
    name: 'Vigormortis',
    description: "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor. [-1 Outsider]",
  },
  nodashii: {
    name: 'No Dashii',
    description: "Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned.",
  },
  vortox: {
    name: 'Vortox',
    description: "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.",
  },
  
  // Sects and Violets - Travellers
  barista: {
    name: 'Barista',
    description: "Each night, until dusk, 1) a player becomes sober, healthy & gets true info, or 2) their ability works twice. They learn which.",
  },
  harlot: {
    name: 'Harlot',
    description: "Each night*, choose a living player: if they agree, you learn their character, but you both might die.",
  },
  butcher: {
    name: 'Butcher',
    description: "Each day, after the 1st execution, you may nominate again.",
  },
  bonecollector: {
    name: 'Bone Collector',
    description: "Once per game, at night*, choose a dead player: they regain their ability until dusk.",
  },
  deviant: {
    name: 'Deviant',
    description: "If you were funny today, you cannot die by exile.",
  },
} as const;

export type CharacterID = keyof typeof _characters

export const CHARACTERS = Object.entries(_characters).reduce(
  (acc, [id, val]) => {
    acc[id as CharacterID] = { ...val, id: id as CharacterID };
    return acc;
  },
  {} as Record<CharacterID, BOTCCharacter>,
);


