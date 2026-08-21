import { IconCalendarShare, IconCopy } from '@tabler/icons-react';
import Button from 'components/input/button';
import CopyToClipboard from 'components/input/copy-to-clipboard';
import TextInput from 'components/input/text-input';
import Modal from 'components/modal';
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
    <Modal
      title={lang('Spelningskalender', 'Gig calendar')}
      withCloseButton
      target={
        <Button>
          <IconCalendarShare />
          {lang('Spelningskalender', 'Gig calendar')}
        </Button>
      }
    >
      {lang(
        'Här är din personliga spelningskalenderlänk! Den kommer innehålla tidigare spelningar du varit på och framtida spelningar du inte tackat nej till.',
        "Here is your personal gig calendar link! It will contain former gigs you have been to and future gigs for which you haven't said you won't attend.",
      )}
      {lang(
        'Klistra in den i valfritt kalenderprogram.',
        'Paste it into a calendar program of your choice.',
      )}
      <div className='flex items-end gap-2'>
        <div className='grow'>
          <TextInput readOnly value={gigIcsLink} />
        </div>
        <CopyToClipboard
          text={gigIcsLink}
          onPressTooltip={lang(
            'Kalenderlänk kopierad!',
            'Calendar link copied!',
          )}
          tooltipPosition='top'
        >
          <IconCopy />
        </CopyToClipboard>
      </div>
    </Modal>
  );
};

export default ExportCalendar;
