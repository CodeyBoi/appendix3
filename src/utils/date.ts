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
  slagverk: 'Ihålig banjo',
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
