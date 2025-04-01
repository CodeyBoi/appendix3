import dayjs from 'dayjs';

export const newUTCDate = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

export const calcOperatingYearInterval = (year: number) => {
  const start = new Date(year, 8, 1); // September 1st
  const operatingYearEnd = new Date(year + 1, 7, 31); // August 31st next year
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  // If we're in the same year, we want to show the stats up to today
  const end = currentDate < operatingYearEnd ? currentDate : operatingYearEnd;
  return { start, end };
};

export const getOperatingYear = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return month >= 8 ? year : year - 1;
};

export const isAprilFools = () => {
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  return month === 3 && day === 1;
};

const aprilFoolsInstruments: Record<string, string> = {
  piccola: 'Pytteliten banjo',
  flöjt: 'Banjo på tvärs',
  oboe: 'Obanjo',
  klarinett: 'Svart banjo',
  fagott: 'Banjott',
  basklarinett: 'Basbanjonett',
  sopransax: 'Skrotad banjo',
  altsax: 'Altekamererenbanjo',
  tenorsax: 'Stor altekamererenbanjo',
  barytonsax: 'Stor kurvig banjo',
  horn: 'Rund banjo',
  trumpet: 'Treknappsbanjo',
  trombon: 'Dragbanjo',
  eufonium: 'Fånig banjo',
  tuba: 'Låg banjo',
  slagverk: 'Banjo',
  balett: 'Snurrig banjo',
  dirigent: 'Banjo på vift',
  annat: 'Banjo på avvägar',
};

export const aprilFoolsInstrumentLabel = (instrument: string) => {
  if (!isAprilFools()) {
    return instrument;
  } else {
    return aprilFoolsInstruments[instrument.toLowerCase()] ?? 'Okänd banjo';
  }
};

export const startOperatingYear = 2010;

export const isChristmas = () => new Date().getMonth() === 11;

export const isJuly = () => new Date().getMonth() === 6;

const parseGigTime = (date: Date, time: string) => {
  // `time` is a string describing a time of day in UTC+1
  // Only consider the first two characters (incase `time` is '21:15ish')
  const [hour = NaN, minute = NaN] = time
    .split(/[:.]/)
    .map((s) => parseInt(s.slice(0, 2)));
  if (isNaN(hour) || isNaN(minute)) {
    return undefined;
  }
  const dateTime = new Date(date);
  dateTime.setUTCHours(hour - 1, minute);
  return dateTime;
};

export const getGigCalenderDates = (gig: {
  date: Date;
  meetup: string;
  start: string;
}) => {
  const meetup = parseGigTime(gig.date, gig.meetup);
  const start = parseGigTime(gig.date, gig.start);

  if (!meetup && !start) {
    return undefined;
  } else if (meetup && !start) {
    return {
      start: meetup,
      end: dayjs(meetup).add(2, 'hours').toDate(),
    };
  } else if (!meetup && start) {
    return {
      start,
      end: dayjs(start).add(2, 'hours').toDate(),
    };
  }

  if (!meetup || !start) {
    throw Error(
      'This should be unreachable as the above would filter out this case',
    );
  }

  // Handle the edge case where e.g `gig.meetup === '23:30' && gig.start === '00:30'`
  // (i.e. `start` is before `meetup`)
  if (start.getTime() < meetup.getTime()) {
    start.setDate(start.getDate() + 1);
  }

  const delta = start.getTime() - meetup.getTime();
  const end = new Date(meetup.getTime() + 2 * delta + 30 * 60 * 1000);
  return {
    start: meetup,
    end,
  };
};
