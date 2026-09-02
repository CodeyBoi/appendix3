'use client';

import { QRCodeSVG } from 'qrcode.react';
import BotcCharacterPanel from '../character-panel';
import {
  CAROUSEL_EDITIONS,
  CharacterId,
  CHARACTERS,
  CharacterType,
  Edition,
  EDITIONS,
  getAllCharacters,
  getDefaultAlignment,
  getJinxes,
  getType,
  getWikiLink,
  isEvil,
  isGood,
} from '../characters';
import Modal from 'components/modal';
import Button from 'components/input/button';
import { IconQrcode } from '@tabler/icons-react';
import { CharacterCountTable } from '../character-select';
import { cn } from 'utils/class-names';
import Jinx from '../jinx';
import { useState } from 'react';
import Link from 'next/link';
import { filterNone } from 'utils/array';

interface BotcSheetPageProps {
  searchParams: BotcSheetPageSearchParams;
}

interface BotcSheetPageSearchParams {
  name?: string;
  characters?: string;
  editionId?: string;
}

const getEdition = (searchParams: BotcSheetPageSearchParams) => {
  const { name, characters, editionId } = searchParams;
  if (name && characters) {
    const editionCharacters = decodeURIComponent(characters).split(',');
    const edition = editionCharacters.reduce<Edition>(
      (acc, id) => {
        const character = CHARACTERS[id];
        if (!character) {
          return acc;
        }
        acc[character.team].push(id);
        return acc;
      },
      {
        id: 'custom',
        name: decodeURIComponent(name),
        townsfolk: [],
        outsiders: [],
        minions: [],
        demons: [],
        travellers: [],
      },
    );
    return edition;
  } else if (editionId) {
    const edition = EDITIONS.concat(CAROUSEL_EDITIONS).find(
      (edition) => edition.id === decodeURIComponent(editionId),
    );
    if (!edition) {
      console.error(`Edition with id '${editionId}' could not be found`);
      return undefined;
    }
    return edition;
  } else {
    console.error(
      `Insufficient character sheet search parameters: ${JSON.stringify(
        searchParams,
      )}`,
    );
    return undefined;
  }
};

const BotcSheetPage = ({ searchParams }: BotcSheetPageProps) => {
  const [selected, setSelected] = useState<CharacterId | null>(null);

  const edition = getEdition(searchParams);
  if (!edition) {
    return (
      <h5>
        Insufficient character sheet search parameters:{' '}
        {JSON.stringify(searchParams)}
      </h5>
    );
  }

  const qrUrl = window.location.toString();

  const toCharacterGroup = (characterType: CharacterType) => {
    const characters = edition[characterType];
    if (characters.length <= 0) {
      return null;
    }
    const border = isGood(characterType)
      ? 'border-blue-500'
      : isEvil(characterType)
      ? 'border-red-600'
      : 'border-l-blue-500 border-r-red-600 border-t-0 border-b-0';
    const subtleBorder = isGood(characterType)
      ? 'border-blue-500/30'
      : isEvil(characterType)
      ? 'border-red-600/30'
      : 'border-blue-500/30';
    const bg = isGood(characterType)
      ? 'bg-blue-500'
      : isEvil(characterType)
      ? 'bg-red-600'
      : 'bg-gradient-to-r from-blue-500 to-red-600';
    return (
      <div className='flex flex-col'>
        <details
          className={cn('flex flex-col rounded border-2', border)}
          open={characterType !== 'travellers'}
        >
          <summary
            className={cn(
              'select-none pl-1 font-castelar text-lg text-white hover:cursor-pointer',
              bg,
            )}
          >
            {characterType}
          </summary>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {filterNone(
              characters.map((characterId) => CHARACTERS[characterId]),
            ).map(({ id, name, description, image }) => {
              return (
                <div
                  key={id}
                  className={cn(
                    'border px-2 py-1 hover:cursor-pointer',
                    subtleBorder,
                    selected === id && 'bg-red-600/20',
                  )}
                  onClick={() => {
                    if (selected === id) {
                      setSelected(null);
                    } else {
                      setSelected(id);
                    }
                  }}
                >
                  <BotcCharacterPanel
                    name={name}
                    imgSrc={image[0]}
                    imgLink={getWikiLink(id) ?? undefined}
                    description={description}
                    alignment={getDefaultAlignment(id)}
                    showDescription
                    jinxes={jinxes.flatMap((jinx) =>
                      jinx[0].includes(id)
                        ? jinx[0].filter((jinxId) => jinxId !== id)
                        : [],
                    )}
                    isTraveller={getType(id) === 'travellers'}
                  />
                </div>
              );
            })}
          </div>
          {characterType === 'travellers' && (
            <div className='flex w-full justify-center'>
              <div className={cn('h-0.5 w-full', bg)} />
            </div>
          )}
        </details>
      </div>
    );
  };

  const jinxes = getJinxes(getAllCharacters(edition));
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='hidden font-castelar lg:block'>{edition.name}</h3>
      <h4 className='font-castelar lg:hidden'>{edition.name}</h4>
      {toCharacterGroup('townsfolk')}
      {toCharacterGroup('outsiders')}
      {toCharacterGroup('minions')}
      {toCharacterGroup('demons')}
      {jinxes.length > 0 && (
        <details
          open
          className='flex flex-col rounded border-2 border-yellow-600'
        >
          <summary className='select-none bg-yellow-600 pl-1 font-castelar text-lg text-white hover:cursor-pointer'>
            Jinxes
          </summary>
          {jinxes.map(([[first, second], description]) => (
            <div
              key={`jinx-${first}-${second}`}
              className='border border-yellow-600/30 px-2 py-1'
            >
              <Jinx
                first={first}
                second={second}
                description={description.description}
              />
            </div>
          ))}
        </details>
      )}
      {toCharacterGroup('travellers')}
      <div className='flex justify-center'>
        <CharacterCountTable />
      </div>
      {qrUrl && (
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
              <Link href={qrUrl}>
                <QRCodeSVG value={qrUrl} size={256} fgColor='#ce0c00' />
              </Link>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default BotcSheetPage;
