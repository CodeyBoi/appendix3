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
        emailTo: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { name, email, instrument, description, emailTo } = input;

      const mailTransport = createTransport(process.env.EMAIL_SERVER);
      const recipient = emailTo || 'info@bleckhornen.org';
      const mail = {
        from: process.env.EMAIL_FROM,
        to: recipient,
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
