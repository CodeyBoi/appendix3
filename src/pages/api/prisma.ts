import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: any, res: any) {
  console.log(req.query);
  const users = await prisma.user.findMany();
  res.json(users);
}