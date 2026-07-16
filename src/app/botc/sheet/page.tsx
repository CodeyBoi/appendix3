import { QRCodeSVG } from 'qrcode.react';
import BotcCharacterPanel from '../character-panel';
import {
  CHARACTER_TYPES,
  CharacterId,
  CHARACTERS,
  Edition,
  getWikiLink,
  isEvil,
  isGood,
} from '../characters';
import Modal from 'components/modal';
import Button from 'components/input/button';
import { IconQrcode } from '@tabler/icons-react';
import { CharacterCountTable } from '../character-select';
import { cn } from 'utils/class-names';

interface BotcSheetPageProps {
  searchParams: {
    name: string;
    characters: string;
  };
}

const BotcSheetPage = ({
  searchParams: { characters: charactersProp, name },
}: BotcSheetPageProps) => {
  const url = `${process.env.NEXTAUTH_URL}/botc/sheet?name=${name}&characters=${charactersProp}`;
  const characters = decodeURIComponent(charactersProp).split(',');
  const edition = characters.reduce<Edition>(
    (acc, id) => {
      const character = CHARACTERS[id as CharacterId];
      acc[character.team].push(id as CharacterId);
      return acc;
    },
    {
      id: 'custom',
      name,
      townsfolk: [],
      outsiders: [],
      minions: [],
      demons: [],
      travellers: [],
    },
  );
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='hidden font-castelar lg:block'>
        {decodeURIComponent(name)}
      </h3>
      <h4 className='font-castelar lg:hidden'>{decodeURIComponent(name)}</h4>
      {CHARACTER_TYPES.map((characterType) => {
        const characters = edition[characterType];
        if (characters.length <= 0) {
          return null;
        }
        const border = isGood(characterType)
          ? 'border-blue-500'
          : isEvil(characterType)
          ? 'border-red-600'
          : 'border-neutral-500';
        const subtleBorder = isGood(characterType)
          ? 'border-blue-500/30'
          : isEvil(characterType)
          ? 'border-red-600/30'
          : 'border-neutral-500/30';
        const bg = isGood(characterType)
          ? 'bg-blue-500'
          : isEvil(characterType)
          ? 'bg-red-600'
          : 'bg-neutral-500';
        return (
          <div key={characters.join(',')} className='flex flex-col gap-2'>
            <details
              className={cn('flex flex-col rounded border-2', border)}
              open={characterType !== 'travellers'}
            >
              <summary
                className={cn(
                  'pl-1 font-castelar text-lg text-white hover:cursor-pointer',
                  bg,
                )}
              >
                {characterType}
              </summary>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                {characters
                  .map((characterId) => CHARACTERS[characterId])
                  .map(({ id, name, description, image }) => {
                    return (
                      <div
                        key={id}
                        className={cn('border px-2 py-1', subtleBorder)}
                      >
                        <BotcCharacterPanel
                          name={name}
                          imgSrc={image?.[0] ?? ''}
                          imgLink={getWikiLink(id)}
                          description={description}
                          showDescription
                        />
                      </div>
                    );
                  })}
              </div>
            </details>
          </div>
        );
      })}
      <div className='flex justify-center'>
        <CharacterCountTable />
      </div>
      <div className='flex justify-center'>
        <Modal
          title='Share Character Sheet'
          withCloseButton
          target={
            <Button compact>
              <IconQrcode />
              Share Character Sheet
            </Button>
          }
        >
          <div className='flex justify-center'>
            <QRCodeSVG value={url} size={256} fgColor='#ce0c00' />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BotcSheetPage;
