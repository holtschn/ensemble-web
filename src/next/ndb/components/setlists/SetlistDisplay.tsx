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
      {/* Download Actions */}
      <div className="middle-column pb-6">
        <div className="flex gap-3 justify-end">
          <Button onClick={() => handleDownload('parts')} variant="secondary">
            <Icon name="download" alt="Download" className="h-4 w-4 mr-2" />
            Stimmen herunterladen
          </Button>
          <Button onClick={() => handleDownload('fullScore')} variant="secondary">
            <Icon name="download" alt="Download" className="h-4 w-4 mr-2" />
            Partituren herunterladen
          </Button>
        </div>
      </div>

      {/* Allocations Table */}
      <div>
        <PlayerAllocationDisplay items={setlist.items} />
      </div>
    </div>
  );
};

export default SetlistDisplay;
