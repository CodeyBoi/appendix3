import { IconCalendarShare } from '@tabler/icons-react';
import CopyToClipboard from 'components/input/copy-to-clipboard';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

const ExportCalendar = async () => {
  const corps = await api.corps.getSelf.query();

  const gigIcsLink = `${
    process.env.NEXTAUTH_URL
  }/api/trpc/gig.exportCalendar?input=${encodeURIComponent(
    JSON.stringify({ json: { corpsId: corps.id } }),
  )}`;
  return (
    <CopyToClipboard
      text={gigIcsLink}
      onPressTooltip={lang(
        'Kalenderlänk kopierad! Klistra in den i valfritt kalenderprogram.',
        'Calendar link copied! Paste it into your calendar of choice.',
      )}
      tooltipPosition='bottom'
    >
      <IconCalendarShare />
      {lang('Spelningskalender', 'Gig calendar')}
    </CopyToClipboard>
  );
};

export default ExportCalendar;
