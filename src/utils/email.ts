interface EmailObject {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

export const createMailtoLink = ({
  to,
  subject,
  body,
  cc,
  bcc,
}: EmailObject) => {
  const fields = [];

  if (subject) fields.push(`subject=${subject}`);
  if (body) fields.push(`body=${body}`);
  if (cc) fields.push(`cc=${cc}`);
  if (bcc) fields.push(`bcc=${bcc}`);

  return encodeURIComponent(
    `mailto:${to}${fields.length > 0 ? '?' + fields.join('&') : ''}`,
  );
};
