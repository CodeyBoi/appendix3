const Burger = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick?: () => void;
}) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <button className='flex flex-col gap-1 p-3' onClick={handleClick}>
      <div
        className={`w-5 h-0.5 bg-white rounded-full transform transition-transform ${
          active ? 'rotate-45 translate-y-1.5' : ''
        }`}
      />
      <div
        className={`w-5 h-0.5 bg-white rounded-full transform transition-all ${
          active ? 'opacity-0' : ''
        }`}
      />
      <div
        className={`w-5 h-0.5 bg-white rounded-full transform transition-transform ${
          active ? '-rotate-45 -translate-y-1.5' : ''
        }`}
      />
    </button>
  );
};

export default Burger;
