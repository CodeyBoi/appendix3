import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';

type ActionIconVariant = 'default' | 'subtle';
const variants: Record<ActionIconVariant, string> = {
  default: 'bg-red-600 hover:bg-red-700 text-white',
  subtle: 'bg-transparent hover:bg-red-600/10 text-red-600',
};

type ActionIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ActionIconVariant;
  href?: string;
};

const ActionIcon = ({
  children,
  onClick,
  variant = 'default',
  href,
  ...props
}: ActionIconProps) => {
  const element = (
    <button
      type='button'
      className={`flex items-center justify-center p-1 rounded ${variants[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );

  if (href) {
    return <Link href={href}>{element}</Link>;
  }

  return element;
};

export default ActionIcon;
