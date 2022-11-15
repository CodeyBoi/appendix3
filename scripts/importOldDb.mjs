import { PrismaClient } from "@prisma/client";
import fs from "fs";
import JSONStream from "JSONStream";

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

const oldGigTypes = [
  "Ospecificerat!",          // Ospecificerat
  "Pärmspelning!",           // Pärmspelning
  "Marschspelning!",         // Marschspelning
  "Ospecificerat!",          // Resa
  "Fest!",                   // Fest
  "Repa!",                   // Repa
  "Party-marsch-spelning!",  // Festspelning
];

const INSTRUMENTS = [
  'Piccolo',
  'Flöjt',
  'Oboe',
  'Klarinett',
  'Fagott',
  'Basklarinett',
  'Sopransaxofon',
  'Altsaxofon',
  'Tenorsaxofon',
  'Barytonsaxofon',
  'Horn',
  'Trumpet',
  'Trombon',
  'Eufonium',
  'Tuba',
  'Slagverk',
  'Fötter',
  'Dirigent',
  'Annat',
];

const oldInstruments = [
  "Dirigent",
  "Flöjt",
  "Klarinett",
  "Oboe",
  "Altsaxofon",
  "Fagott",
  "Trumpet",
  "Horn",
  "Euphonium",
  "Trombon",
  "Tuba",
  "Slagverk",
  "Basklarinett",
  "Balett",
  "Annat",
];


const gigTypeIds = oldGigTypes.reduce((acc, type, i) => {
  acc[i] = GIG_TYPES.indexOf(type);
  return acc;
}, {});

const instrumentIds = oldInstruments.reduce((acc, instrument, i) => {
  acc[i + 1] = INSTRUMENTS.indexOf(instrument);
  return acc;
}, {});

// These objects are used to map the old database's IDs to the new ones
const gigIds = {};
const corpsIds = {};

const parseDate = (date) => {
  if (!date) {
    return new Date('1970-01-01');
  } else if (date.includes('-')) {
    return new Date(date);
  }

  // The regexes checks that the date is only digits (otherwise `22-23/11` would match)
  else if (date.length === 8 && date.match(/^\d+$/)) {
    return new Date(date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8));
  } else if (date.length === 6 && date.match(/^\d+$/)) {
    const first = date.charAt(0);
    const century = first === '0' || first === '1' || first === 2 ? '20' : '19';
    return new Date(century + date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4, 6));
  }
  return new Date('1970-01-01');
}

const prisma = new PrismaClient();

if (process.argv.length < 3) {
  console.log("Usage: node importOldDb.mjs <oldDbDump.json>");
  process.exit(1);
}
const dbPath = process.argv[2];
console.log("Importing old db dump from " + dbPath + "...");
const stream = JSONStream.parse("*");

stream.on("data", async (data) => {
  if (data.type !== "table") {
    return;
  }

  if (data.name === "Events") {
    for (const row of data.data) {
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
        console.log("Skipping event in the future: " + Name);
        continue;
      }

      const timeRegex = /\d{1,2}[\.:]\d{2}/g;
      const [meetup = undefined, start = undefined] = [...Times.matchAll(timeRegex)].map((m) => m[0]);

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
  }

  else if (data.name === "Users") {
    for (const row of data.data) {
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
      const userId = (await prisma.user.upsert({
        where: { email: Email },
        update: user,
        create: user,
      })).id;
      console.log("Created user " + userId + " with email " + Email);

      const corps = {
        number: Number ? parseInt(Number) : undefined,
        firstName: FirstName,
        lastName: LastName,
        bNumber: BNumber ? parseInt(BNumber.slice(1)) : undefined,
        instruments: {
          create: [
            {
              instrument: {
                connect: {
                  name: INSTRUMENTS[instrumentIds[Section]] || "Annat",
                },
              },
              isMainInstrument: true,
            },
            // {
            //   instrument: {
            //     connect: {
            //       name: INSTRUMENTS[instrumentIds[AltSec]],
            //     },
            //   },
            //   isMainInstrument: false,
            // },
          ],
        },
        isActive: Status === 1,
        user: {
          connect: {
            id: userId,
          },
        },
      };
      corpsIds[UserID] = (await prisma.corps.create({ data: corps })).id;
    }
  }
});

fs.createReadStream(dbPath).pipe(stream);


