import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useEffect, useMemo, useState } from 'react';
import NightOrderEntry from './night-order-entry';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import {
  CharacterId,
  CHARACTERS,
  getType,
  isGlobalDroisoned,
} from './characters';
import { getNightOrder } from './night-order';
import { filterNone } from 'utils/array';

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

  const characters = players.flatMap((p) => {
    const res = [p.characterId];
    const trueRole = p.getTrueRole();
    if (trueRole) {
      res.push(trueRole);
    }
    return res;
  });
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
    if (nightOrderIndex === -1) {
      setPreviousReminder(
        getNightOrderEntry({
          index: 0,
          firstNight: allNightOrders.firstNight,
          otherNights: allNightOrders.otherNights,
        }),
      );
      setNightOrderIndex(0);
      return;
    }
    setPreviousReminder(
      getNightOrderEntry({
        index: nightOrderIndex,
        firstNight: allNightOrders.firstNight,
        otherNights: allNightOrders.otherNights,
      }),
    );
  }, [nightOrderIndex]);

  useEffect(() => {
    if (nightOrderIndex === 0 || nightOrderIndex === -1) {
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

  const isGlobalDroison =
    reminder.entry.id && isGlobalDroisoned(getType(reminder.entry.id), players);
  const currentPlayers = players
    .filter(
      (player) =>
        player.characterId === reminder.entry.id ||
        (reminder.entry.id !== undefined &&
          player.getTrueRole() === reminder.entry.id),
    )
    .map((player) => ({
      name: player.name,
      isDroisoned: player.isDroisoned(),
      trueRole: player.getTrueRole(),
    }));
  const isAnyCurrentPlayerDroisoned =
    currentPlayers.find((player) => player.isDroisoned) !== undefined ||
    isGlobalDroison;
  const areAllCurrentPlayersDroisoned =
    currentPlayers.find((player) => !player.isDroisoned) === undefined ||
    isGlobalDroison;

  const currentPlayerDisguises = filterNone(
    currentPlayers.map((p) => p.trueRole),
  ).filter((trueRole) => trueRole !== reminder.entry.id);

  const warnings = [];
  if (currentPlayerDisguises.length > 0) {
    warnings.push(
      `Is actually ${currentPlayerDisguises
        .map((characterId) =>
          CHARACTERS[characterId]?.reminderTokensGlobal?.[0]?.startsWith('Is ')
            ? CHARACTERS[characterId].reminderTokensGlobal[0]
                .replace('Is', '')
                .trim()
            : CHARACTERS[characterId]?.name,
        )
        .join('/')}`,
    );
  }
  if (
    currentPlayers.length === 1 &&
    (areAllCurrentPlayersDroisoned || isAnyCurrentPlayerDroisoned)
  ) {
    warnings.push('Drunk/Poisoned');
  } else if (currentPlayers.length > 1) {
    if (areAllCurrentPlayersDroisoned) {
      warnings.push('These players are all drunk/poisoned');
    } else if (isAnyCurrentPlayerDroisoned) {
      warnings.push('Some of these players are drunk/poisoned');
    }
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
              (p) =>
                (p.characterId === reminder.entry.id ||
                  p.getTrueRole() === reminder.entry.id) &&
                p.isAlive,
            ) === undefined
          }
          topRightText={`${formatCardinal(reminder.night)} ${
            reminder.entry.name === 'Daytime' ? 'day' : 'night'
          }`}
          warnings={warnings}
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
