import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useEffect, useMemo, useState } from 'react';
import NightOrderEntry from './night-order-entry';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import { CharacterId, isDroisoned } from './characters';
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

  const characters = players.map((p) => p.characterId);
  const allNightOrders = useMemo(() => {
    const nightOrder = getNightOrder(characters);
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
  }, [characters.toSorted().join('::')]);

  const [reminder, setPreviousReminder] = useState(
    getNightOrderEntry({
      index: nightOrderIndex,
      firstNight: allNightOrders.firstNight,
      otherNights: allNightOrders.otherNights,
    }),
  );

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
    if (nightOrderIndex === 0) {
      return;
    }
    for (let i = 0; i < 516; i++) {
      const nightAbility = getNightOrderEntry({
        index: i,
        firstNight: allNightOrders.firstNight,
        otherNights: allNightOrders.otherNights,
      });
      if (nightAbility.night > reminder.night) {
        break;
      } else if (
        nightAbility.night === reminder.night &&
        nightAbility.entry.id === reminder.entry.id &&
        nightAbility.entry.description === reminder.entry.description
      ) {
        setNightOrderIndex(i);
        break;
      }
    }
  }, [
    players
      .map((p) => p.characterId)
      .sort()
      .join('::'),
  ]);

  const currentPlayers = players
    .filter((player) => player.characterId === reminder.entry.id)
    .map((player) => ({ name: player.name, isDroisoned: isDroisoned(player) }));
  const isAnyCurrentPlayerDroisoned =
    currentPlayers.find((player) => player.isDroisoned) !== undefined;
  const areAllCurrentPlayersDroisoned =
    currentPlayers.find((player) => !player.isDroisoned) === undefined;

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
            reminder.entry.name ??
            currentPlayers
              .filter((p) => p.name?.trim())
              .map((p) => p.name)
              .join(', ')
          }
          characterId={reminder.entry.id}
          text={reminder.entry.description}
          muted={
            reminder.entry.name !== 'Demon' &&
            reminder.entry.name !== 'Minions' &&
            reminder.entry.name !== 'Daytime' &&
            players.find(
              (p) => p.characterId === reminder.entry.id && p.isAlive,
            ) === undefined
          }
          topRightText={`${formatCardinal(reminder.night)} ${
            reminder.entry.name === 'Daytime' ? 'day' : 'night'
          }`}
          warnings={
            currentPlayers.length === 0
              ? []
              : currentPlayers.length === 1
              ? isAnyCurrentPlayerDroisoned
                ? ['Drunk/Poisoned']
                : []
              : areAllCurrentPlayersDroisoned
              ? ['These players are all drunk/poisoned']
              : isAnyCurrentPlayerDroisoned
              ? ['Some of these players are drunk/poisoned']
              : []
          }
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
