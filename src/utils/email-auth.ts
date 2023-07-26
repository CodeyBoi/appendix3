import { Theme } from 'next-auth';
import { SendVerificationRequestParams } from 'next-auth/providers';
import { createTransport } from 'nodemailer';
import { prisma } from '../server/db/client';

const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const { identifier, url, provider, theme } = params;
  const user = await prisma.user.findUnique({
    where: { email: identifier },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { host } = new URL(url);
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: `"Blindtarmen" <${provider.from}>`,
    subject: `Inloggningslänk till Blindtarmen`,
    text: text({ url }),
    html: html({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
};

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
    <body
      style="
        background: linear-gradient(215deg, #810300 0%, #210000 100%);
        border-radius: 32px;
        min-height: 400px;
        display: flex;
        align-items: center;
      "
    >
      <table
        width="100%"
        border="0"
        cellspacing="20"
        cellpadding="0"
        style="
          max-width: 600px;
          margin: auto;
          border-radius: 10px;
          font-family: Helvetica, sans-serif;
        "
      >
        <tr>
          <td
            align="center"
            style="
              padding: 10px 0px;
              font-size: 22px;
              font-family: Helvetica, sans-serif;
              color: white;
            "
          >
            Välkommen till <strong style="color: #ce0c00">Blindtarmen</strong>!
          </td>
        </tr>
        <tr>
          <td
            align="center"
            style="
              font-size: 16px;
              font-family: Helvetica, sans-serif;
              color: white;
            "
          >
            Klicka på knappen nedan för att slutföra inloggningsprocessen.
          </td>
        </tr>
        <tr>
          <td align="center">
            <a
              href="${url}"
              target="_blank"
              style="
                font-size: 18px;
                font-family: Helvetica, Arial, sans-serif;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                padding: 10px 20px;
                border: 0;
                display: inline-block;
                font-weight: bold;
                background-image: linear-gradient(185deg, #ce0c00 0%, darkred 100%);
                clip-path: url(#squircle-mask-115-41-2.6);
              "
              >Logga in</a
            >
          </td>
        </tr>
        <tr>
          <td
            align="center"
            style="
              padding: 10px 0px;
              font-size: 16px;
              font-family: Helvetica, sans-serif;
              color: white;
            "
          >
            Har du några problem, kontakta oss på
            <a style="color: #ce0c00" href="mailto:itk@bleckhornen.org"
              ><strong style="color: #ce0c00">itk@bleckhornen.org</strong></a
            >. <br /><br /><br />
            <i>
              Vänliga hälsningar,<br />
              ITK
            </i>
          </td>
        </tr>
        <tr>
          <td>
            <p>
              (Ser mailet konstigt ut? <a href="${url}" target="_blank">Klicka här</a>.)
            </p>
          </td>
        </tr>
      </table>
      <svg width="0" height="0" viewBox="0 0 115 41" style="position: absolute">
        <defs>
          <clipPath id="squircle-mask-115-41-2.6">
            <path
              transform="
                    scale(20.5)
                    rotate(0)"
              d="M4.609756097560975,2 4.6844861911474,1.999546818173204 4.758798363737149,1.9972673680447497 4.83227703151729,1.9922214674492196 4.904511271971879,1.9837334138561538 4.97509712192737,1.9712871686025766 5.043639836678533,1.9544848430698254 5.109756097560975,1.9330216431087006 5.173076155624598,1.9066677603743802 5.233245899419709,1.8752537583855766 5.289928835331895,1.8386576491369007 5.342807969390802,1.7967923344044265 5.391587580029005,1.7495920723531708 5.43599487187697,1.6969962141227477 5.475781501345414,1.6389274314450581 5.510724965463394,1.5752593887601636 5.54062984620518,1.505763572510795 5.565328903347116,1.430011615823956 5.584684009742799,1.347169802684207 5.598586923786104,1.255474837659742 5.606959894742156,1.1503634554057314 5.609756097560975,1 5.609756097560975,1 5.609756097560975,2 5.609756097560975,1 5.60930291573418,0.9252699064135758 5.607023465605725,0.8509577338238256 5.601977565010195,0.7774790660436857 5.593489511417129,0.7052448255890958 5.581043266163552,0.634658975633605 5.564240940630801,0.5661162608824419 5.542777740669676,0.5 5.516423857935355,0.43667994193637805 5.485009855946552,0.3765101981412665 5.4484137466978755,0.31982726222908064 5.406548431965402,0.26694812817017366 5.359348169914146,0.2181685175319702 5.306752311683723,0.1737612256840051 5.248683529006033,0.1339745962155614 5.185015486321139,0.09903113209758085 5.11551967007177,0.06912625135579586 5.039767713384931,0.04442719421385932 4.956925900245182,0.02507208781817638 4.865230935220717,0.011169173774871477 4.760119552966707,0.0027962028188198707 4.609756097560975,0 1,0 4.609756097560975,0 1,0 0.9252699064135758,0.00045318182679598973 0.8509577338238256,0.0027326319552501976 0.7774790660436857,0.007778532550780537 0.7052448255890958,0.01626658614384613 0.634658975633605,0.028712831397423533 0.5661162608824419,0.045515156930174605 0.5,0.06697835689129927 0.43667994193637805,0.09333223962561976 0.3765101981412665,0.12474624161442338 0.31982726222908064,0.16134235086309945 0.26694812817017366,0.20320766559557346 0.2181685175319702,0.2504079276468292 0.1737612256840051,0.3030037858772523 0.1339745962155614,0.36107256855494185 0.09903113209758085,0.42474061123983653 0.06912625135579586,0.49423642748920504 0.04442719421385932,0.569988384176044 0.02507208781817638,0.6528301973157931 0.011169173774871477,0.744525162340258 0.0027962028188198707,0.8496365445942687 0,1 0,1 0,1 0,1 0.00045318182679598973,1.0747300935864241 0.0027326319552501976,1.1490422661761746 0.007778532550780537,1.2225209339563143 0.01626658614384613,1.2947551744109043 0.028712831397423533,1.365341024366395 0.045515156930174605,1.433883739117558 0.06697835689129927,1.5 0.09333223962561976,1.563320058063622 0.12474624161442338,1.6234898018587334 0.16134235086309945,1.6801727377709192 0.20320766559557346,1.7330518718298262 0.2504079276468292,1.78183148246803 0.3030037858772523,1.826238774315995 0.36107256855494185,1.8660254037844386 0.42474061123983653,1.900968867902419 0.49423642748920504,1.930873748644204 0.569988384176044,1.9555728057861406 0.6528301973157931,1.9749279121818235 0.744525162340258,1.9888308262251284 0.8496365445942687,1.99720379718118 1,2 1,2 4.609756097560975,2Z"
            ></path>
          </clipPath>
        </defs>
      </svg>
    </body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url }: { url: string }) {
  return `Välkommen till Blindtarmen!\n\nBesök följande länk för att logga in:\n${url}\n\n`;
}

export default sendVerificationRequest;
