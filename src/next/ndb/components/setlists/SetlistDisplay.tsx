import React from 'react';
import { SetlistItem } from '@/next/ndb/types';
import Button from '@/next/ndb/components/Button';
import Icon from '@/next/ndb/components/Icon';
import PlayerAllocationDisplay from '@/next/ndb/components/setlists/PlayerAllocationDisplay';
import { downloadSetlist } from '@/next/ndb/api/actions';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/next/ndb/constants';

interface SetlistDisplayProps {
  setlist: SetlistItem;
  onEdit: () => void;
}

const SetlistDisplay: React.FC<SetlistDisplayProps> = ({ setlist, onEdit }) => {
  const handleDownload = async (fileType: 'parts' | 'fullScore') => {
    try {
      toast.info(SUCCESS_MESSAGES.SETLIST_DOWNLOADED);
      const result = await downloadSetlist({
        setlistId: setlist.id,
        fileType,
      });

      if (result?.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      toast.error('Fehler beim Herunterladen der Setlist');
      console.error('Download error:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{setlist.displayName}</h2>
          <p className="text-sm text-gray-500 mt-1">{setlist.items.length} Stücke</p>
        </div>
        <Button onClick={onEdit} variant="default">
          <Icon name="edit" alt="Edit" className="h-4 w-4 mr-2" />
          Bearbeiten
        </Button>
      </div>

      {/* Download Actions */}
      <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200">
        <Button onClick={() => handleDownload('parts')} variant="highlighted">
          <Icon name="download" alt="Download" className="h-4 w-4 mr-2" />
          Stimmen herunterladen
        </Button>
        <Button onClick={() => handleDownload('fullScore')} variant="default">
          <Icon name="download" alt="Download" className="h-4 w-4 mr-2" />
          Partituren herunterladen
        </Button>
      </div>

      {/* Allocations Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Besetzung</h3>
        <PlayerAllocationDisplay items={setlist.items} />
      </div>
    </div>
  );
};

export default SetlistDisplay;
