import { QRCodeSVG } from 'qrcode.react';
import BotcCharacterPanel from '../character-panel';
import {
  CHARACTER_TYPES,
  CharacterId,
  CHARACTERS,
  Edition,
  getImagePathFromId,
  getType,
  isFallOfRomeCharacter,
} from '../characters';
import Modal from 'components/modal';
import Button from 'components/input/button';
import { IconQrcode } from '@tabler/icons-react';

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
      acc[getType(id as CharacterId)].push(id as CharacterId);
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
      <h4 className='font-castelar'>{decodeURIComponent(name)}</h4>
      {CHARACTER_TYPES.map((characterType) => {
        const characters = edition[characterType];
        if (characters.length <= 0) {
          return null;
        }
        return (
          <div key={characters.join(',')} className='flex flex-col gap-2'>
            <details open={characterType !== 'travellers'}>
              <summary className='font-castelar text-lg hover:cursor-pointer'>
                {characterType}
              </summary>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                {characters
                  .map((characterId) => CHARACTERS[characterId])
                  .map(({ id, name, description }) => {
                    const wikiLink = isFallOfRomeCharacter(id)
                      ? `https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/almanac.html#${id}_fall_of_rome`
                      : `https://wiki.bloodontheclocktower.com/${encodeURIComponent(
                          name.replaceAll(' ', '_'),
                        )}`;
                    return (
                      <div key={id} className='px-2 py-1'>
                        <BotcCharacterPanel
                          name={name}
                          imgSrc={getImagePathFromId(id)}
                          imgLink={wikiLink}
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
      <div className='h-6' />
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
