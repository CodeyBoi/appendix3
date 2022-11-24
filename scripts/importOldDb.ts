import { Corps, CorpsInstrument, Gig, PrismaClient, User } from "@prisma/client";
import cuid from "cuid";
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

interface Event {
  Id: string;
  Name: string;
  Description: string;
  EventDate: string;
  Times: string;
  Other: string;
  Other2: string;
  EventTypeID: string;
  Adress: string;
}

interface OldUser {
  UserID: string;
  Number: string;
  FirstName: string;
  LastName: string;
  Email: string;
  BNumber: string;
  Section: string;
  AltSec: string;
  Stamledare: string;
  Status: string;
  Enabled: string;
}

interface EventStats {
  EVENTID: string;
  TYPEID: string;
  TITLE: string;
  EVENTDATE: string;
  DESCRIPTION: string;
  Points: string;
}

interface StatsItem {
  EVENTID: string;
  USERID: string;
  Points: string;
}

const gigTypeIds = OLD_GIG_TYPES.reduce(
  (acc: { [key: string]: number }, type, i) => {
    acc[i.toString()] = GIG_TYPES.indexOf(type) + 1;
    return acc;
  },
  {}
);

const instrumentIds = OLD_INSTRUMENTS.reduce(
  (acc: { [key: string]: number }, instrument, i) => {
    acc[(i + 1).toString()] = INSTRUMENTS.indexOf(instrument) + 1;
    return acc;
  },
  {}
);

const parseDate = (date: string | null) => {
  if (!date) {
    return new Date("1970-01-01");
  } else if (date.includes("-")) {
    return new Date(date);
  }

  else if (date.length === 10) {
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
  const prisma = new PrismaClient();
  try {
    // These objects are used to map the old database's IDs to the new ones
    const gigIds: { [key: string]: string } = {};
    const corpsIds: { [key: string]: string } = {};
    const userIds: { [key: string]: string } = {};

    if (process.argv.length < 3) {
      console.log("Usage: node importOldDb.mjs <old-db-dir-path>");
      process.exit(1);
    }

    const dirPath = process.argv[2];
    if (!dirPath) {
      console.log("Usage: node importOldDb.mjs <old-db-dir-path>");
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

    console.log("Importing points for events...");
    const eventTable = getTable("STATISTICS_EVENT");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventPoints = eventTable.data.reduce((acc: { [key: string]: number }, row: any) => {
      acc[row.EVENTID] = parseInt(row.Points);
      return acc;
    }, {} as { [key: string]: number });
    const events = eventTable.data.map((row: EventStats) => {
      const {
        EVENTID,
        TYPEID,
        TITLE,
        EVENTDATE,
        DESCRIPTION,
        Points,
      } = row;

      if (TYPEID === "1" || TYPEID === "2") {
        console.log("Skipping event " + TITLE + " because it is a rehearsal");
        return undefined;
      }

      const date = parseDate(EVENTDATE);
      if (date.getFullYear() >= 2023) {
        console.log("Skipping event " + TITLE + " because it's in the future");
        return undefined;
      }

      const id = cuid();
      gigIds[EVENTID] = id;

      return {
        id,
        typeId: 1,
        title: TITLE,
        date: date.toString() === "Invalid Date" ? new Date("1970-01-01") : date,
        description: DESCRIPTION,
        points: parseInt(Points),
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).filter((e: any) => e !== undefined);

    await prisma.gig.deleteMany({});
    await prisma.gig.createMany({
      data: events,
    });

    console.log("Importing users...");
    const userTable = getTable("Users");
    const emails: { [key: string]: boolean } = {};
    const users: { user: User, corps: Corps, mainInstrument: CorpsInstrument, altInstrument?: CorpsInstrument, oldUserId: string }[] = userTable.data.map((row: OldUser) => {
      const {
        UserID,
        Number,
        FirstName,
        LastName,
        Email = "",
        BNumber,
        Section,
        AltSec,
        // Stamledare,
        Status,
        Enabled,
        // LastLoggin,
      } = row;

      if (!Email) {
        console.log("Skipping user " + FirstName + " " + LastName + " because they have no email");
        return undefined;
      }

      if (Enabled === "0") {
        console.log("Skipping user " + FirstName + " " + LastName + " because they are disabled");
        return undefined;
      }

      if (emails[Email]) {
        console.log("Skipping user " + FirstName + " " + LastName + " because their email " + Email + " has already been added");
        return undefined;
      }

      const userId = cuid();
      const corpsId = cuid();

      emails[Email] = true;
      const user = {
        id: userId,
        email: Email,
      };
      // console.log(`Importing user ${FirstName} ${LastName} with email ${Email}`);
      const altInstrumentIndex = parseInt(AltSec);
      const mainInstrument = {
        instrumentId: instrumentIds[Section],
        isMainInstrument: true,
      };
      const altInstrument = altInstrumentIndex && AltSec !== "0" ? {
        instrumentId: instrumentIds[altInstrumentIndex],
        isMainInstrument: false,
      } : undefined;

      const corps = {
        id: corpsId,
        number: Number ? parseInt(Number) : undefined,
        firstName: FirstName,
        lastName: LastName,
        bNumber: BNumber ? parseInt(BNumber.slice(1)) : undefined,
        isActive: parseInt(Status ?? "0") === 1,
        userId,
      };

      userIds[UserID] = userId;
      corpsIds[UserID] = corpsId;

      return {
        user,
        corps,
        mainInstrument,
        altInstrument,
        oldUserId: UserID,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).filter((u: any) => u !== undefined);
    await prisma.user.deleteMany({});
    await prisma.corps.deleteMany({});

    await prisma.$transaction([
      prisma.user.createMany({
        data: users.map((u) => u.user),
      }),
      prisma.corps.createMany({
        data: users.map((u) => u.corps),
      }),
    ]);

    await prisma.corpsInstrument.deleteMany({});
    await prisma.corpsInstrument.createMany({
      data: users.map((u, i) => ({
        ...u.mainInstrument,
        corpsId: corpsIds[users[i]?.oldUserId ?? ""] ?? "",
      })),
    });
    const altInstruments = users.map((u) => u.altInstrument).filter((i) => i !== undefined);
    // await prisma.corpsInstrument.createMany({
    //   data: altInstruments.map((instrument: any, i) => ({
    //     ...instrument,
    //     corpsId: corpsIds[userTable.data[i].UserID] ?? 0,
    //   }))
    // });

    console.log("Importing stats for users...");
    const userStatsTable = getTable("STATISTICS_ITEM");
    const userStats = (await Promise.all(userStatsTable.data.map(async (row: StatsItem) => {
      const { EVENTID, USERID, Points } = row;

      const gigId = gigIds[EVENTID];
      const corpsId = corpsIds[USERID];
      const points = parseInt(Points);

      if (!corpsId) {
        console.log("Skipping user stats for user " + USERID + " because they don't exist");
        return undefined;
      }

      if (!gigId) {
        console.log("Skipping stats for event " + EVENTID + " because it doesn't exist");
        return undefined;
      }

      if (eventPoints[EVENTID] !== undefined && eventPoints[EVENTID] !== points) {
        // console.log(`Adding new gig with ${points} points for user ${USERID}`);
        console.log("Event exists, but point values does not match for event " + EVENTID + " for user " + USERID + "!");
        const newGigId = (await prisma.gig.create({
          data: {
            title: "Poäng för tidigare spelningar",
            date: new Date("1970-01-01"),
            points,
            typeId: 1,
            countsPositively: true,
          }
        })).id;
        const gigSignup = {
          corpsId,
          gigId: newGigId,
          attended: true,
          instrumentId: instrumentIds["15"],
          signupStatusId: 1,
        };
        return { gigSignup };
      }

      // console.log(`Adding gig signup for corps ${corpsId}`);
      const gigSignup = {
        corpsId,
        gigId,
        attended: true,
        instrumentId: instrumentIds["15"],
        signupStatusId: 1,
      };
      return { gigSignup };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }))).filter((u: any) => u !== undefined);
    // await prisma.gig.createMany({
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   data: userStats.map((u: any) => u.newGig).filter((u: any) => u !== undefined)
    // });

    await prisma.gigSignup.deleteMany({});
    await prisma.gigSignup.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: userStats.map((u: any) => u.gigSignup),
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

main();
