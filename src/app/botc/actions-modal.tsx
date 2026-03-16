import { useMemo, useState } from 'react';
import { CharacterId, CHARACTERS, Reminder } from './characters';
import ReminderToken from './reminder-token';
import Modal from 'components/modal';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import Button from 'components/input/button';
import Switch from 'components/input/switch';
import Divider from 'components/divider';

type SelectMode = 'none' | 'player';

interface BotcActionsModalProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  playerIndex: number;
  players: BotcPlayer[];
  setPlayers: (newPlayers: BotcPlayer[]) => void;
  allCharacters?: CharacterId[];
}

const BotcActionsModal = ({
  open,
  setOpen,
  playerIndex,
  players,
  setPlayers,
  allCharacters = [],
}: BotcActionsModalProps) => {
  const player = players[playerIndex];

  if (!player) {
    return null;
  }

  const character = CHARACTERS[player.characterId];
  const [selectMode, setSelectMode] = useState<SelectMode>('none');
  const [showAllReminders, setShowAllReminders] = useState(false);
  const [addMultipleReminders, setAddMultipleReminders] = useState(false);

  const characters = new Set(players.map((p) => p.characterId));
  const reminderTokens = useMemo(
    () =>
      (showAllReminders
        ? allCharacters
        : allCharacters.filter((id) => characters.has(id))
      ).flatMap(
        (id) =>
          CHARACTERS[id].reminderTokens?.map((reminderText) => ({
            characterId: id,
            message: reminderText,
          })) ?? [],
      ),
    [showAllReminders, allCharacters, characters],
  );

  const killOrRevivePlayer = () => {
    const newPlayers = players.slice();
    const player = newPlayers[playerIndex];
    if (!player) throw new Error('Invalid playerIndex in CharacterToken');
    player.isAlive = !player.isAlive;
    setOpen(false);
    setPlayers(newPlayers);
  };

  const canKill = character.reminderTokens?.includes('Killed by') ?? false;

  const reminderHash = (reminder: Reminder) =>
    `id:${reminder.characterId},message:${reminder.message}`;
  const alreadyAdded = new Set(player.reminders.map(reminderHash));

  const filterReminderTokens = (reminder: Reminder) => {
    if (alreadyAdded.has(reminderHash(reminder))) {
      return false;
    }

    if (
      reminder.message === 'No ability' &&
      reminder.characterId !== player.characterId
    ) {
      return false;
    }

    return true;
  };

  return (
    <Modal
      title={
        selectMode === 'none'
          ? character.name + (player.name ? ` (${player.name})` : '')
          : 'Select player'
      }
      withCloseButton
      open={open}
      onFocus={() => {
        setOpen(true);
      }}
      onBlur={() => {
        setOpen(false);
        setSelectMode('none');
      }}
    >
      {character.description}
      {selectMode === 'none' && (
        <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
            <Button fullWidth onClick={killOrRevivePlayer}>
              {player.isAlive ? 'Kill' : 'Revive'} this player
            </Button>
            <Button fullWidth disabled={!canKill}>
              Kill another player
            </Button>
          </div>
          <Divider />
          <div className='flex flex-col gap-2 px-2'>
            <div className='flex flex-col gap-4 md:flex-row'>
              <h4>Add Reminder</h4>
              <Switch
                label='Show tokens not in play'
                value={showAllReminders}
                onChange={setShowAllReminders}
              />
              <Switch
                label='Add multiple tokens'
                value={addMultipleReminders}
                onChange={setAddMultipleReminders}
              />
            </div>
            <div className='flex flex-wrap gap-4'>
              {reminderTokens
                .filter(filterReminderTokens)
                .map(({ characterId, message }) => (
                  <div key={characterId + message} className='w-20'>
                    <ReminderToken
                      onClick={() => {
                        const newPlayers = players.slice();
                        newPlayers[playerIndex]?.reminders.push({
                          characterId,
                          message,
                        });
                        setPlayers(newPlayers);
                        if (!addMultipleReminders) {
                          setOpen(false);
                        }
                      }}
                      characterId={characterId}
                      text={message}
                    />
                  </div>
                ))}
            </div>
          </div>
          {player.reminders.length > 0 && (
            <>
              <h4>Added reminders (click to remove)</h4>
              <div className='flex flex-wrap gap-4'>
                {player.reminders.map((reminder, i) => (
                  <div
                    key={`player:${playerIndex}${reminder.characterId}${reminder.message}`}
                    className='w-20'
                  >
                    <ReminderToken
                      characterId={reminder.characterId}
                      text={reminder.message}
                      onClick={() => {
                        const newPlayers = players.slice();
                        newPlayers[playerIndex]?.reminders.splice(i, 1);
                        setPlayers(newPlayers);
                        if (!addMultipleReminders) {
                          setOpen(false);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {selectMode === 'player' && 'test'}
    </Modal>
  );
};

export default BotcActionsModal;
