import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useEffect, useMemo, useState } from 'react';
import NightOrderEntry from './night-order-entry';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import { CharacterId } from './characters';
import { getNightOrder } from './night-order';

interface NightOrderPreviewProps {
  players: BotcPlayer[];
  nightOrderIndex: number;
  setNightOrderIndex: (n: number) => void;
}

interface NightOrderAbility {
  id?: CharacterId;
  name?: string;
  description: string;
}

const CARDINALS: Record<number, string> = {
  1: 'First',
  2: 'Second',
  3: 'Third',
  4: 'Fourth',
  5: 'Fifth',
  6: 'Sixth',
  7: 'Seventh',
  8: 'Eighth',
  9: 'Ninth',
  10: 'Tenth',
  11: 'Eleventh',
  12: 'Twelveth',
  13: 'Thirteenth',
  14: 'Fourteenth',
  15: 'Fifteenth',
  16: 'Sixteenth',
  17: 'Seventeenth',
  18: 'Eighteenth',
  19: 'Nineteenth',
  20: 'Twentieth',
};

const formatCardinal = (index: number) => CARDINALS[index] ?? `${index}th`;

const DAYTIME_ENTRY = {
  name: 'Daytime',
  description:
    "It's a new day! Open for discussion, then open for nominations and hold votes for executions.",
};

const getNightOrderEntry = ({
  index,
  firstNight,
  otherNights,
}: {
  index: number;
  firstNight: NightOrderAbility[];
  otherNights: NightOrderAbility[];
}): { night: number; entry: NightOrderAbility } => {
  const firstNightEntry = firstNight[index];
  if (firstNightEntry) {
    return { night: 1, entry: firstNightEntry };
  } else if (index === firstNight.length) {
    return { night: 1, entry: DAYTIME_ENTRY };
  } else {
    const modIndex = (index - firstNight.length - 1) % (otherNights.length + 1);
    if (modIndex === otherNights.length) {
      return {
        night:
          2 +
          Math.floor(
            (index - firstNight.length - 1) / (otherNights.length + 1),
          ),
        entry: DAYTIME_ENTRY,
      };
    }
    const otherNightsEntry = otherNights[modIndex];
    return {
      night:
        2 +
        Math.floor((index - firstNight.length - 1) / (otherNights.length + 1)),
      entry: otherNightsEntry as NightOrderAbility,
    };
  }
};

const NightOrderPreview = ({
  players,
  nightOrderIndex,
  setNightOrderIndex,
}: NightOrderPreviewProps) => {
  const isTeensyville = players.length < 7;

  const allNightOrders = useMemo(() => {
    const nightOrder = getNightOrder(players.map((p) => p.characterId));
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
      ).concat(nightOrder.firstNight),
      otherNights: nightOrder.otherNights,
    };
  }, [players]);

  const { entry, night } = getNightOrderEntry({
    index: nightOrderIndex,
    firstNight: allNightOrders.firstNight,
    otherNights: allNightOrders.otherNights,
  });

  const [previousReminder, setPreviousReminder] = useState({ entry, night });

  const characterIds = players.map((p) => p.characterId).join('::');

  useEffect(() => {
    setPreviousReminder(
      getNightOrderEntry({
        index: nightOrderIndex,
        firstNight: allNightOrders.firstNight,
        otherNights: allNightOrders.otherNights,
      }),
    );
  }, [nightOrderIndex]);

  useEffect(() => {
    for (let i = 0; i < 516; i++) {
      const nightAbility = getNightOrderEntry({
        index: i,
        firstNight: allNightOrders.firstNight,
        otherNights: allNightOrders.otherNights,
      });
      if (nightAbility.night > previousReminder.night) {
        break;
      } else if (
        nightAbility.night === previousReminder.night &&
        nightAbility.entry.id === previousReminder.entry.id &&
        nightAbility.entry.description === previousReminder.entry.description
      ) {
        setNightOrderIndex(i);
        break;
      }
    }
  }, [characterIds]);

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
            entry.name !== 'Daytime' &&
            players.find((p) => p.characterId === entry.id && p.isAlive) ===
              undefined
          }
          topRightText={`${formatCardinal(night)} ${
            entry.name === 'Daytime' ? 'day' : 'night'
          }`}
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
