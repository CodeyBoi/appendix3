interface ObjectType {
  [key: string]: string;
}

const cookieParser = (cookieString: string) => {
  if (cookieString === '') return {};

  const pairs = cookieString.split(';');

  const splittedPairs = pairs.map((cookie) => cookie.split('='));

  const cookieObj = splittedPairs.reduce(
    (obj: ObjectType, cookie: string[]) => {
      obj[decodeURIComponent(cookie[0]!.trim())] = decodeURIComponent(
        cookie[1]!.trim(),
      );

      return obj;
    },
    {},
  );

  return cookieObj;
};

export default cookieParser;
