import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const GIG_TYPES = [
  "Ospecificerat!",
  "Pärmspelning!",
  "Marschspelning!",
  "Party-marsch-spelning!",
  "Julkoncert!",
  "Vårkoncert!",
  "Fest!",
  "Repa!",
];

const INSTRUMENTS = [
  "Piccolo",
  "Flöjt",
  "Oboe",
  "Klarinett",
  "Fagott",
  "Basklarinett",
  "Sopransaxofon",
  "Altsaxofon",
  "Tenorsaxofon",
  "Barytonsaxofon",
  "Horn",
  "Trumpet",
  "Trombon",
  "Eufonium",
  "Tuba",
  "Slagverk",
  "Fötter",
  "Dirigent",
  "Annat",
];

// These lists are used to map the old database's index values to the new ones
const OLD_GIG_TYPES = [
  // New type,                 // Old type (index)
  "Ospecificerat!", // 0 => Ospecificerat
  "Pärmspelning!", // 1 => Pärmspelning
  "Marschspelning!", // 2 => Marschspelning
  "Ospecificerat!", // 3 => Resa
  "Fest!", // 4 => Fest
  "Repa!", // 5 => Repa
  "Party-marsch-spelning!", // 6 => Festspelning
];

const OLD_INSTRUMENTS = [
  "Dirigent", // 1  => Dirigent
  "Flöjt", // 2  => Flöjt
  "Klarinett", // 3  => Klarinett
  "Oboe", // 4  => Oboe
  "Altsaxofon", // 5  => Saxofon
  "Fagott", // 6  => Fagott
  "Trumpet", // 7  => Trumpet
  "Horn", // 8  => Horn
  "Eufonium", // 9  => Euphonium
  "Trombon", // 10 => Trombon
  "Tuba", // 11 => Tuba
  "Slagverk", // 12 => Slagverk
  "Basklarinett", // 13 => Basklarinett
  "Fötter", // 14 => Balett
  "Annat", // 15 => Lyra
];

// const OLD_TABLE_NAMES = [
//   "Events",
//   "Users",
//   "STATISTICS_EVENT",
//   "STATISTICS_ITEM",
// ];

const gigTypeIds = OLD_GIG_TYPES.reduce(
  (acc: { [key: number]: number }, type, i) => {
    acc[i] = GIG_TYPES.indexOf(type) + 1;
    return acc;
  },
  {}
);

const instrumentIds = OLD_INSTRUMENTS.reduce(
  (acc: { [key: number]: number }, instrument, i) => {
    acc[i + 1] = INSTRUMENTS.indexOf(instrument);
    return acc;
  },
  {}
);

const parseDate = (date: string) => {
  if (!date) {
    return new Date("1970-01-01");
  } else if (date.includes("-")) {
    return new Date(date);
  }
  // The regexes checks that the date is only digits (otherwise e.g. `22-23/11` would match)
  else if (date.length === 8 && date.match(/^\d+$/)) {
    return new Date(
      date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8)
    );
  } else if (date.length === 6 && date.match(/^\d+$/)) {
    const first = date.charAt(0);
    const century =
      first === "0" || first === "1" || first === "2" ? "20" : "19";
    return new Date(
      century +
        date.slice(0, 2) +
        "-" +
        date.slice(2, 4) +
        "-" +
        date.slice(4, 6)
    );
  }
  return new Date("1970-01-01");
};

const main = async () => {
  // These objects are used to map the old database's IDs to the new ones
  const gigIds: { [key: number]: number } = {};
  const corpsIds: { [key: number]: number } = {};

  const prisma = new PrismaClient();

  if (process.argv.length < 3) {
    console.log("Usage: node importOldDb.mjs <oldDbDump.json>");
    process.exit(1);
  }

  const dirPath = process.argv[2];
  if (!dirPath) {
    console.log("Usage: node importOldDb.mjs <oldDbDump.json>");
    process.exit(1);
  }

  console.log("Importing old db dump from directory " + dirPath + "...");
  const filenames = fs.readdirSync(dirPath);

  const getTable = (table: string) => {
    const filename = filenames.find((f) => f.endsWith(table + ".json"));
    if (!filename) {
      console.log("Could not find file for table " + table);
      process.exit(1);
    }
    let data = fs.readFileSync(path.join(dirPath, filename)).toString();
    while (data.toString().charAt(0) !== "{") {
      data = data.slice(1);
    }
    return JSON.parse(data);
  };

  console.log("Importing events...");
  const eventTable = getTable("Events");
  for (const row of eventTable.data) {
    const {
      Id,
      Name,
      Description,
      EventDate,
      Times,
      Other,
      Other2,
      EventTypeID,
      Adress,
    } = row;

    const date = parseDate(EventDate);
    if (date.getFullYear() >= 2023) {
      continue;
    }

    const timeRegex = /\d{1,2}[\.:]\d{2}/g;
    const [meetup = undefined, start = undefined] = [
      ...Times.matchAll(timeRegex),
    ].map((m) => m[0]);

    const gig = {
      title: Name,
      description: Description,
      date: date.toString() === "Invalid Date" ? new Date(1970, 0, 1) : date,
      meetup,
      start,
      checkbox1: Other,
      checkbox2: Other2,
      location: Adress,
      points: 1,
      typeId: gigTypeIds[EventTypeID] || 1,
    };

    const id = parseInt(Id);
    gigIds[id] = (await prisma.gig.create({ data: gig })).id;
  }

  console.log("Importing users...");
  const userTable = getTable("Users");
  for (const row of userTable.data) {
    const {
      UserID,
      Number,
      FirstName,
      LastName,
      Email,
      BNumber,
      Section,
      AltSec,
      // Stamledare,
      Status,
    } = row;

    if (!Email) {
      continue;
    }

    const user = {
      email: Email,
    };
    const userId = (
      await prisma.user.upsert({
        where: { email: Email },
        update: user,
        create: user,
      })
    ).id;
    console.log(`Importing user ${FirstName} ${LastName} with email ${Email}`);
    const instrumentIndex = parseInt(Section);
    const altInstrumentIndex = parseInt(AltSec);
    const instruments = {
      create: [
        {
          instrument: {
            connect: {
              name: OLD_INSTRUMENTS[instrumentIndex - 1],
            },
          },
          isMainInstrument: true,
        },
        {
          instrument: {
            connect: {
              name: OLD_INSTRUMENTS[altInstrumentIndex - 1],
            },
          },
          isMainInstrument: false,
        },
      ].filter((i) => i.instrument.connect.name !== undefined),
    };

    const corps = {
      number: Number ? parseInt(Number) : undefined,
      firstName: FirstName,
      lastName: LastName,
      bNumber: BNumber ? parseInt(BNumber.slice(1)) : undefined,
      instruments,
      isActive: Status === 1,
      user: {
        connect: {
          id: userId,
        },
      },
    };
    corpsIds[UserID] = (await prisma.corps.create({ data: corps })).id;
  }
};

main();
