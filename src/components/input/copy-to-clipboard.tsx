'use client';

import React, { useState } from 'react';
import Button, { ButtonProps } from 'components/input/button';
import Tooltip from 'components/tooltip';
import { lang } from 'utils/language';

type CopyToClipboardProps = Omit<ButtonProps, 'onClick'> & {
  text: string;
};

const CopyToClipboard = ({
  text,
  children,
  ...props
}: CopyToClipboardProps) => {
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
    setHasClicked(true);
    setTimeout(() => {
      setHasClicked(false);
    }, 3000);
  };

  const buttonElement = (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );

  return hasClicked ? (
    <Tooltip text={lang('Kopierat till urklipp!', 'Copied to clipboard!')}>
      {buttonElement}
    </Tooltip>
  ) : (
    buttonElement
  );
};

export default CopyToClipboard;
