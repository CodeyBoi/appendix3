import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useMemo, useState } from 'react';
import NightOrderEntry from './night-order-entry';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import { CharacterId, FIRST_NIGHT_TEXT, OTHER_NIGHTS_TEXT } from './characters';

interface NightOrderPreviewProps {
  players: BotcPlayer[];
  allCharacters: CharacterId[];
}

interface NightOrderAbility {
  id?: CharacterId;
  name?: string;
  description: string;
}

const getNightOrderEntry = ({
  index,
  firstNight,
  otherNights,
}: {
  index: number;
  firstNight: NightOrderAbility[];
  otherNights: NightOrderAbility[];
}) => {
  const firstNightEntry = firstNight[index];
  if (firstNightEntry) {
    return { night: 1, entry: firstNightEntry };
  } else {
    const otherNightsEntry =
      otherNights[(index - firstNight.length) % otherNights.length];
    return {
      night: 2 + Math.floor((index - firstNight.length) / otherNights.length),
      entry: otherNightsEntry,
    };
  }
};

const NightOrderPreview = ({
  players,
  allCharacters,
}: NightOrderPreviewProps) => {
  const [nightOrderIndex, setNightOrderIndex] = useState(0);
  const isTeensyville = players.length < 7;

  const allNightOrders = useMemo(() => {
    const gameCharactersSet = new Set(players.map((p) => p.characterId));
    return {
      firstNight: (isTeensyville
        ? ([] as NightOrderAbility[])
        : [
            {
              name: 'Minions',
              description: 'Wake all the Minions and show them the Demon.',
            },
            {
              name: 'Demon',
              description:
                'Wake the Demon, show them their minions and their 3 bluffs (characters not in play).',
            },
          ]
      ).concat(FIRST_NIGHT_TEXT.filter(({ id }) => gameCharactersSet.has(id))),
      otherNights: OTHER_NIGHTS_TEXT.filter(({ id }) =>
        gameCharactersSet.has(id),
      ),
    };
  }, [allCharacters]);

  const { entry, night } = getNightOrderEntry({
    index: nightOrderIndex,
    firstNight: allNightOrders.firstNight,
    otherNights: allNightOrders.otherNights,
  });

  if (!entry) {
    return null;
  }

  return (
    <div className='flex gap-2'>
      <ActionIcon
        variant='subtle'
        disabled={nightOrderIndex === 0}
        onClick={() => {
          setNightOrderIndex(Math.max(nightOrderIndex - 1, 0));
        }}
      >
        <IconChevronLeft />
      </ActionIcon>
      <div className='grow text-xs lg:text-sm'>
        <NightOrderEntry
          name={
            entry.name ??
            players
              .filter((p) => p.characterId === entry.id)
              .map((p) => p.name)
              .join(', ')
          }
          characterId={entry.id}
          text={entry.description}
          muted={
            entry.name !== 'Demon' &&
            entry.name !== 'Minions' &&
            players.find((p) => p.characterId === entry.id && p.isAlive) ===
              undefined
          }
          topRightText={`Night ${night}`}
        />
      </div>
      <ActionIcon
        variant='subtle'
        disabled={
          nightOrderIndex === allNightOrders.firstNight.length - 1 &&
          allNightOrders.otherNights.length === 0
        }
        onClick={() => {
          if (
            nightOrderIndex === allNightOrders.firstNight.length - 1 &&
            allNightOrders.otherNights.length === 0
          ) {
            return;
          }
          setNightOrderIndex(nightOrderIndex + 1);
        }}
      >
        <IconChevronRight />
      </ActionIcon>
    </div>
  );
};

export default NightOrderPreview;
