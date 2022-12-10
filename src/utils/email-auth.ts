import { Theme } from "next-auth"
import { SendVerificationRequestParams } from "next-auth/providers"
import { createTransport } from "nodemailer"
import { prisma } from "../server/db/client"

const sendVerificationRequest = async (params: SendVerificationRequestParams) => {
  const { identifier, url, provider, theme } = params

  const user = await prisma.user.findUnique({
    where: { email: identifier },
    select: {
      id: true,
      email: true,
    },
  });

  console.log("user", user);

  if (!user) {
    throw new Error("User not found");
  }

  const { host } = new URL(url)
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Inloggningslänk till Blindtarmen`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
 function html(params: { url: string; host: string; theme: Theme }) {
  const { url } = params;
  return `
    <body style="display: flex; flex-direction: column; align-items: center;">
      <table
        width="100%"
        border="0"
        style="max-width: fit-content;"
      >
        <tr>
          <td>
            <h1 style="text-align: center;">Välkommen till Blindtarmen!</h1>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin-top: 0;">Klicka på knappen nedan för att slutföra inloggningen:</p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <a
              href="${url}"
              target="_blank"
              style="background-image: linear-gradient(
                185deg,
                #ce0c00 0%,
                darkred 100%
              ); width: fit-content; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; border-radius: 8px; padding: 10px 20px; border: 0; display: inline-block; font-weight: bold;"
            >
              Logga in
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <p>
              Uppkommer några problem, kopiera och klistra in följande länk i din webbläsare:<br>
              <a href="${url}" target="_blank">${url}</a>
            </p>
            <p style="margin-top: 0;">
              Funkar det fortfarande inte, kontakta oss på <a href="mailto:itk@bleckhornen.org">
                itk@bleckhornen.org
              </a>
            </p>
            <p style="margin-top: 0; margin-bottom: 0;">
              Vänliga hälsningar,
            </p>
            <p style="margin-top: 0;">
              ITK
            </p>
          </td>
        </tr>
      </table>
    </body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}

export default sendVerificationRequest;
