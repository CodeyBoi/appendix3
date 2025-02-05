'use client';

import React, { ReactNode, useState } from 'react';
import Button, { ButtonProps } from 'components/input/button';
import Tooltip, { Position } from 'components/tooltip';

type CopyToClipboardProps = Omit<ButtonProps, 'onClick'> & {
  text: string;
  onPressTooltip?: ReactNode;
  tooltipPosition?: Position;
};

const CopyToClipboard = ({
  text,
  children,
  onPressTooltip,
  tooltipPosition,
  ...props
}: CopyToClipboardProps) => {
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
    if (!hasClicked) {
      setHasClicked(true);
      setTimeout(() => {
        setHasClicked(false);
      }, 3000);
    }
  };

  const buttonElement = (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );

  return hasClicked && onPressTooltip ? (
    <Tooltip text={onPressTooltip} position={tooltipPosition}>
      {buttonElement}
    </Tooltip>
  ) : (
    buttonElement
  );
};

export default CopyToClipboard;
