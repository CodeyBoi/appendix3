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
        <img
          className='h-8 w-8 scale-150 lg:h-12 lg:w-12'
          loading='lazy'
          src={imgSrc}
        />
        <h4 className='hidden lg:block'>{name}</h4>
        <h6 className='lg:hidden'>{name}</h6>
      </div>
      {showDescription && <p className='text-xs lg:text-sm'>{description}</p>}
    </div>
  );
};

export default BOTCCharacterPanel;
