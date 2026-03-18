'use client';

interface InfoTokenProps {
  text: string;
}

const InfoToken = ({ text }: InfoTokenProps) => {
  return (
    <div className='rounded border p-12 shadow-md'>
      <h3 className='text-wrap text-center'>{text}</h3>
    </div>
  );
};

export default InfoToken;
