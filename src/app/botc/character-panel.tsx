interface BOTCCharacterPanelProps {
  name: string;
  imgSrc: string;
  description: string;
  showDescription: boolean;
}

const BOTCCharacterPanel = ({
  name,
  imgSrc,
  description,
  showDescription,
}: BOTCCharacterPanelProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-4'>
        <img className='h-12 w-12 scale-150' loading='lazy' src={imgSrc} />
        <h4>{name}</h4>
      </div>
      {showDescription && <p className='text-sm'>{description}</p>}
    </div>
  );
};

export default BOTCCharacterPanel;
