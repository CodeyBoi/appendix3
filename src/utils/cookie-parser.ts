interface ObjectType {
  [key: string]: string;
}

const cookieParser = (cookieString: string) => {
  if (cookieString === '') return {};

  const pairs = cookieString.split(';');

  const splittedPairs = pairs.map((cookie) => cookie.split('='));

  const cookieObj = splittedPairs.reduce(
    (obj: ObjectType, cookie: string[]) => {
      const [c1, c2] = cookie;
      if (c1 && c2) {
        obj[decodeURIComponent(c1.trim())] = decodeURIComponent(c2.trim());
      }
      return obj;
    },
    {},
  );
  return cookieObj;
};

export default cookieParser;
