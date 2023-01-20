import { createHash, randomBytes } from 'crypto';

export const GenerateToken = () => {
  const unhashedToken = randomBytes(32).toString('hex');
  return unhashedToken;
};

export const HashToken = (token: string) => {
  return createHash('sha256')
    .update(`${token + process.env.NEXTAUTH_SECRET}`)
    .digest('hex');
};
