import { useState } from 'react';
import { CharacterId, CHARACTERS } from './characters';
import ReminderToken from './reminder-token';
import Modal from 'components/modal';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import Button from 'components/input/button';
import Switch from 'components/input/switch';

type SelectMode = 'none' | 'reminder' | 'player';

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
  const reminderTokens = (
    showAllReminders
      ? allCharacters
      : allCharacters.filter((id) => characters.has(id))
  ).flatMap(
    (id) =>
      CHARACTERS[id].reminderTokens?.map((reminderText) => ({
        id,
        reminderText,
      })) ?? [],
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

  return (
    <Modal
      title={
        selectMode === 'none'
          ? character.name + (player.name ? ` (${player.name})` : '')
          : selectMode === 'reminder'
          ? 'Add reminder token'
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
            <Button fullWidth disabled={!canKill} onClick={killOrRevivePlayer}>
              Kill another player
            </Button>
            <Button
              fullWidth
              onClick={() => {
                setSelectMode('reminder');
              }}
            >
              Add reminder
            </Button>
          </div>
          {player.reminders.length > 0 && (
            <>
              <h5>Added reminders (click to remove)</h5>
              <div className='grid grid-cols-4 gap-y-2 md:grid-cols-5 lg:grid-cols-7'>
                {player.reminders.map((reminder, i) => (
                  <ReminderToken
                    key={`index:${playerIndex}${reminder.characterId}${reminder.message}`}
                    characterId={reminder.characterId}
                    text={reminder.message}
                    onClick={() => {
                      const newPlayers = players.slice();
                      newPlayers[playerIndex]?.reminders.splice(i, 1);
                      setPlayers(newPlayers);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {selectMode === 'reminder' && (
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4'>
            <Switch
              label='Show all'
              value={showAllReminders}
              onChange={setShowAllReminders}
            />
            <Switch
              label='Add multiple'
              value={addMultipleReminders}
              onChange={setAddMultipleReminders}
            />
          </div>
          <div className='grid grid-cols-4 gap-y-2 md:grid-cols-5 lg:grid-cols-7'>
            {reminderTokens.map(({ id, reminderText }) => (
              <ReminderToken
                key={id + reminderText}
                onClick={() => {
                  const newPlayers = players.slice();
                  newPlayers[playerIndex]?.reminders.push({
                    characterId: id,
                    message: reminderText,
                  });
                  setPlayers(newPlayers);
                  if (!addMultipleReminders) {
                    setOpen(false);
                    setSelectMode('none');
                  }
                }}
                characterId={id}
                text={reminderText}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              setSelectMode('none');
            }}
          >
            Cancel
          </Button>
        </div>
      )}
      {selectMode === 'player' && 'test'}
    </Modal>
  );
};

export default BotcActionsModal;
