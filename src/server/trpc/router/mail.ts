import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { createTransport } from 'nodemailer';

export const mailRouter = router({
  application: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        sections: z.array(z.string()),
        description: z.string(),
        emailTo: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        name,
        email,
        sections,
        description,
        emailTo = 'info@bleckhornen.org',
      } = input;
      const mailTransport = createTransport(process.env.EMAIL_SERVER);
      await mailTransport.sendMail({
        subject: 'Ansökan till Bleckhornen från ' + name.trim(),
        from: process.env.EMAIL_FROM,
        to: emailTo,
        cc: email.trim(),
        replyTo: email.trim(),
        text: `Namn: ${name.trim()}\nEmail: ${email.trim()}\nSektion(er): ${sections.join(
          ', ',
        )}.\n\nVad har du spelat/dansat i innan?\n${description.trim()}`,
      });
      return {
        success: true,
      };
    }),

  bookingRequest: publicProcedure
    .input(
      z.object({
        date: z.string(),
        time: z.string(),
        location: z.string(),
        event: z.string().optional(),
        otherInfo: z.string().optional(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        emailTo: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        date,
        time,
        location,
        event = '',
        otherInfo = '',
        name,
        email,
        phone,
        address,
        emailTo = 'styrelsen@bleckhornen.org',
      } = input;
      const mailTransport = createTransport(process.env.EMAIL_SERVER);
      await mailTransport.sendMail({
        subject: 'Bokningsförfrågan från ' + name.trim() + ', ' + date.trim(),
        from: process.env.EMAIL_FROM,
        to: emailTo,
        cc: email.trim(),
        replyTo: email.trim(),
        text:
          `Datum: ${date.trim()}\nTid: ${time.trim()}\nPlats: ${location.trim()}\nEvenemang: ${event.trim()}\nÖvrigt: ${otherInfo.trim()}\n\n` +
          `Kontaktuppgifter\nNamn: ${name.trim()}\nEmail: ${email.trim()}\nTelefon: ${phone.trim()}\nAdress: ${address.trim()}\n`,
      });
      return {
        success: true,
      };
    }),
});
