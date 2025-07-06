import React from 'react';

import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';

const ActionCard: React.FC = () => (
  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
    <Button disabled variant="primary" className="w-full">
      <Icon name="edit" alt="Edit Icon" className="mr-2" />
      Eintrag ändern
    </Button>
  </div>
);

export default ActionCard;
