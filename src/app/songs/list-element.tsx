import Link from 'next/link';

export type SongListElementProps = {
  title: string;
  id: string;
};

const SongListElement = ({ title, id }: SongListElementProps) => {
  return (
    <Link href={`/songs/${id}`}>
      <div className='py-2 pl-6 cursor-pointer hover:bg-red-300/10'>
        {title}
      </div>
    </Link>
  );
};

export default SongListElement;
