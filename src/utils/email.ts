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

  if (subject) fields.push(`subject=${encodeURIComponent(subject)}`);
  if (body) fields.push(`body=${encodeURIComponent(body)}`);
  if (cc) fields.push(`cc=${encodeURIComponent(cc)}`);
  if (bcc) fields.push(`bcc=${encodeURIComponent(bcc)}`);

  return `mailto:${to}${fields.length > 0 ? '?' + fields.join('&') : ''}`;
};
