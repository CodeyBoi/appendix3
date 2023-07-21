import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { createTransport } from 'nodemailer';

export const applicationRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        instrument: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { name, email, instrument, description } = input;

      const mailTransport = createTransport(process.env.EMAIL_SERVER);
      const mail = {
        from: email,
        to: 'hannes.ryberg00@gmail.com',
        subject: 'Ansökan till Bleckhornen',
        text: `
        Namn: ${name}
        Email: ${email}
        Vill gå med i Bleckhornen som ${instrument.toLowerCase()}.
        ${description}
        `,
      };
      await mailTransport.sendMail(mail);

      return {
        success: true,
      };
    }),
});
