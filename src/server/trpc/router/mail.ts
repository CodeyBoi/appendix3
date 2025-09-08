import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { createTransport } from 'nodemailer';
import { Language } from 'hooks/use-language';

interface MailText {
  subject?: string;
  text?: string;
  html?: string;
}

export const mailNewUser = async (email: string, language: Language) => {
  const url = process.env.NEXTAUTH_URL;
  const mailText: Record<Language, MailText> = {
    sv: {
      subject: 'Välkommen till Blindtarmen!',
      text: `Ett konto har skapats för dig på Blindtarmen, vilket är Bleckhornens interna hemsida där man anmäler sig till spelningar och annat!\n\nDu kan nu logga in med mailaddressen som detta mailet skickades till på ${url}!`,
      html: `
        Ett konto har skapats för dig på Blindtarmen, vilket är Bleckhornens egensnickrade hemsida där man anmäler sig till spelningar och annat!
        <br />
        <br />
        Du kan nu logga in med mailadressen som detta mailet skickades till.
        <br />
        <br />
        <br />
        <a
          href="${url}"
          target="_blank"
          style="
            font-size: 18px;
            color: #fafffc;
            text-decoration: none;
            border-radius: 5px;
            padding: 10px 20px;
            border: 0;
            display: inline-block;
            font-weight: bold;
            background-color: #ce0c00
          "
        >
          Ta mig till Blindtarmen!
        </a>
      `,
    },
    en: {
      subject: 'Welcome to Blindtarmen!',
      text: `An account has been created for you at Blindtarmen, which is Bleckhornen's internal website where you sign up for gigs and the like!\n\nYou can now log in using the email address where this mail was sent at ${url}!`,
      html: `
        An account has been created for you at Blindtarmen, which is Bleckhornen's very own website where you sign up for gigs and the like!
        <br />
        <br />
        You can now log in using the email address where this mail was sent.
        <br />
        <br />
        <br />
        <a
          href="${url}"
          target="_blank"
          style="
            font-size: 18px;
            color: #fafffc;
            text-decoration: none;
            border-radius: 5px;
            padding: 10px 20px;
            border: 0;
            display: inline-block;
            font-weight: bold;
            background-color: #ce0c00
          "
        >
          Take me to Blindtarmen!
        </a>
      `,
    },
  };

  const mailTransport = createTransport(process.env.EMAIL_SERVER);
  await mailTransport.sendMail({
    from: `"AMC Bleckhornen" <${process.env.EMAIL_FROM}>`,
    to: email,
    ...mailText[language],
  });
};

export const mailRouter = router({
  application: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        sections: z.array(z.string()),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, sections, description } = input;
      const mailTransport = createTransport(process.env.EMAIL_SERVER);
      const sectionLeaders = await ctx.prisma.section.findMany({
        where: {
          instruments: {
            some: {
              name: {
                in: sections,
              },
            },
          },
        },
        include: {
          leader: {
            include: {
              user: true,
            },
          },
        },
      });
      const to = sectionLeaders.map((section) => section.leader?.user.email);
      await mailTransport.sendMail({
        subject: 'Ansökan till Bleckhornen från ' + name.trim(),
        from: `"AMC Bleckhornen" <${process.env.EMAIL_FROM}>`,
        to: to.join(', '),
        cc: email.trim(),
        bcc: 'styrelsen@bleckhornen.org',
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
