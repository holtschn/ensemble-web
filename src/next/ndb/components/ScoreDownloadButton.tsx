import React, { ComponentProps } from 'react';

import { ScoreFileItem } from '@/next/ndb/types';
import { useFileUpDownLoad } from '@/next/ndb/hooks/useFileUpDownLoad';

import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';

type ButtonProps = ComponentProps<typeof Button>;

interface DownloadButtonProps extends Omit<ButtonProps, 'onClick' | 'disabled' | 'children'> {
  file: ScoreFileItem | null;
  label: string;
}

const ScoreDownloadButton: React.FC<DownloadButtonProps> = ({ file, label, ...buttonProps }) => {
  const { downloadFile, isLoading } = useFileUpDownLoad();
  const isDisabled = !file || isLoading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (file) {
      downloadFile(file);
    }
  };

  return (
    <Button {...buttonProps} variant="outline" disabled={isDisabled} onClick={handleClick}>
      {isLoading ? (
        <Icon name="spinner" alt="Herunterladen..." className="mr-2 h-3 w-3 animate-spin" />
      ) : (
        <Icon name="download" alt="Download" className="mr-2 h-3 w-3" />
      )}
      {label}
    </Button>
  );
};

export default ScoreDownloadButton;
