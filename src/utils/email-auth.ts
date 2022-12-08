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
  const { url } = params
  return `
    <body style="background: linear-gradient(215deg, #810300 0%, #210000 100%); border-radius: 32px; min-height: 400px; display: flex; align-items: center;">
      <table
        width="100%"
        border="0"
        cellspacing="20"
        cellpadding="0"
        style="max-width: 600px; margin: auto; border-radius: 10px; font-family: Helvetica, sans-serif;"
      >
        <tr>
          <td
            align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, sans-serif; color: white"
          >
            Välkommen till <strong style="color: #ce0c00;">Blindtarmen</strong>!
          </td>
        </tr>
        <tr>
          <td
            align="center"
            style="padding: 10px 0px; font-size: 16px; font-family: Helvetica, sans-serif; color: white"
          >
            Klicka på knappen nedan för att slutföra inloggningsprocessen.
          </td>
        </tr>
        <td align="center" style="padding: 20px 0">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td
                align="center"
                style="
                  border-radius: 5px;
                  background-image: linear-gradient(
                    185deg,
                    #ce0c00 0%,
                    darkred 100%
                  );
                "
              >
                <a
                  href="${url}"
                  target="_blank"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 0; display: inline-block; font-weight: bold;"
                  >Logga in</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}

export default sendVerificationRequest;
