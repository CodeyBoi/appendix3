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
    <button className='flex flex-col gap-0.5 p-3' onClick={handleClick}>
      <div
        className={`w-6 h-1 transition-all ${
          active
            ? 'rotate-45 translate-y-1.5 border-0 bg-white rounded-full'
            : 'bg-amber-300 rounded-t-full'
        }`}
      />
      <div
        className={`w-5 ml-0.5 h-1 bg-orange-950 border-t border-t-yellow-400 rounded-full transform transition-all ${
          active ? 'opacity-0' : ''
        }`}
      />
      <div
        className={`w-6 h-1 transition-all ${
          active
            ? '-rotate-45 -translate-y-1.5 border-0 bg-white rounded-full'
            : 'border-t-2 border-t-green-600 bg-amber-300 rounded-b-sm'
        }`}
      />
    </button>
  );
};

export default Burger;
