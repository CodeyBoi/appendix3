import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

const CORPSII = [
  {
    "username": "admin",
    "password": "admin",
    "number": 113,
    "firstName": "Admin",
    "lastName": "Adminsson",
    "email": "admin@localhost",
    "isActive": true,
    "mainInstrument": "Slagverk"
  },
  {
    "username": "user",
    "password": "user",
    "firstName": "Test",
    "lastName": "User",
    "email": "inyourface323@gmail.com",
    "isActive": true,
    "mainInstrument": "Klarinett"
  },
  {
    "username": "Krabben",
    "password": "qwer",
    "number": 516,
    "firstName": "Hannes",
    "lastName": "Ryberg",
    "email": "hannes.ryberg@gmail.com",
    "isActive": true,
    "mainInstrument": "Slagverk"
  },
  {
    "username": "KM2K",
    "password": "qwer",
    "number": 558,
    "firstName": "Aron",
    "lastName": "Paulsson",
    "email": "aron@paulsson.com",
    "isActive": true,
    "mainInstrument": "Basklarinett"
  },
  {
    "username": "bprinoth",
    "password": "qwer",
    "number": 559,
    "firstName": "Bibiana",
    "lastName": "Prinoth",
    "email": "b@prinoth.com",
    "isActive": true,
    "mainInstrument": "Fötter"
  },
  {
    "username": "skelpdar",
    "password": "qwer",
    "number": 521,
    "firstName": "Erik",
    "lastName": "Wallin",
    "email": "erik@wallin.se",
    "isActive": true,
    "mainInstrument": "Horn"
  },
  {
    "username": "johans",
    "password": "qwer",
    "firstName": "Johan",
    "lastName": "Svensson",
    "email": "main@com.se",
    "isActive": false,
    "mainInstrument": "Flöjt"
  }
];

const GIGS = [
  {
    "title": "Födelsedagsspelning!",
    "date": "2023-01-13",
    "meetup": "17:00",
    "points": 1,
    "start": "18:00",
    "description": "Ett fett gig. Det blir najs.",
    "type": "Party-marsch-spelning!"
  },
  {
    "title": "En spelning med en massa anmälningar!",
    "date": "2023-02-14",
    "meetup": "13:00",
    "points": 1,
    "start": "13:30",
    "description": "Denna spelningen har en del anmälningar. Bra om man ska testa hur anmälningar ser ut!",
    "type": "Marschspelning!"
  },
  {
    "title": "En spelning med lång beskrivning!",
    "date": "2023-01-16",
    "meetup": "13:00",
    "points": 1,
    "start": "14:00",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "type": "Pärmspelning!"
  },
  {
    "title": "Julkoncert!",
    "date": "2021-12-07",
    "meetup": "10:00",
    "points": 1,
    "start": "15:00",
    "description": "En spelning som redan varit!",
    "type": "Pärmspelning!"
  },
  {
    "title": "En spelning där anmälan inte öppnat!",
    "date": "2023-10-07",
    "meetup": "15:00",
    "points": 1,
    "start": "16:00",
    "description": "Om du kan anmäla dig till den här spelningen så har någonting gått fel!",
    "type": "Något annat!",
    "signupStart": "2023-10-01"
  }
];

const GIG_TYPES = [
  "Pärmspelning!",
  "Marschspelning!",
  "Party-marsch-spelning!",
  "Julkoncert!",
  "Fest!",
  "Något annat!",
];

const GIG_SIGNUP_STATUSES = [
  "Ja",
  "Nej",
  "Kanske",
  "Ej svarat",
];

const ROLES = [
  "Admin",
];

async function main() {

  // Create instruments
  for (let i = 0; i < INSTRUMENTS.length; i++) {
    const instrument = INSTRUMENTS[i];
    if (!instrument) {
      break;
    }
    await prisma.instrument.upsert({
      where: { id: i + 1 },
      update: { name: instrument },
      create: { id: i + 1, name: instrument },
    });
  }

  // Create corps members
  await prisma.corps.deleteMany({});  
  for (const corps of CORPSII) {
    const user = await prisma.user.findUnique({
      where: { email: corps.email },
    });
    
    if (!user) {
      console.log(`User ${corps.email} not found`);
      continue;
    }

    await prisma.corps.create({
      data: {
        number: corps.number,
        firstName: corps.firstName,
        lastName: corps.lastName,
        isActive: corps.isActive,
        instruments: {
          create: [
            {
              instrument: {
                connect: { name: corps.mainInstrument },
              },
              isMainInstrument: true,
            },
          ]
        },
        user: {
          connect: {
            email: corps.email,
          }
        }
      },
    });
  }

  // Create gig types
  for (let i = 0; i < GIG_TYPES.length; i++) {
    const gigType = GIG_TYPES[i];
    if (!gigType) {
      break;
    }
    await prisma.gigType.upsert({
      where: { id: i + 1 },
      update: { name: gigType },
      create: { id: i + 1, name: gigType },
    });
  }

  // Create gigs
  await prisma.gig.deleteMany({});
  // if (process.env.DATABASE_URL?.endsWith('.sqlite3')) {
  //   await prisma.$executeRawUnsafe("UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'table_name';");
  // } else if (process.env.DATABASE_URL?.startsWith('mysql://')) {
  //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE gig_id_seq RESTART WITH 1`);
  // }

  for (let i = 0; i < GIGS.length; i++) {
    const gig = GIGS[i];
    if (!gig) {
      break;
    }
    await prisma.gig.create({
      data: {
        title: gig.title,
        date: new Date(gig.date),
        meetup: gig.meetup,
        points: gig.points,
        start: gig.start,
        description: gig.description,
        type: {
          connect: { name: gig.type },
        },
      },
    });
  }

  // Create gig signup statuses
  for (let i = 0; i < GIG_SIGNUP_STATUSES.length; i++) {
    const status = GIG_SIGNUP_STATUSES[i];
    if (!status) {
      break;
    }
    await prisma.gigSignupStatus.upsert({
      where: { id: i + 1 },
      update: { value: status },
      create: { id: i + 1, value: status },
    });
  }

  // Create roles
  for (let i = 0; i < ROLES.length; i++) {
    const role = ROLES[i];
    if (!role) {
      break;
    }
    await prisma.role.upsert({
      where: { id: i + 1 },
      update: { name: role },
      create: { id: i + 1, name: role },
    });
  }

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
