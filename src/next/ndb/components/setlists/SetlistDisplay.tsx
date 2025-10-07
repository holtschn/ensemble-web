import React from 'react';
import { SetlistItem } from '@/next/ndb/types';
import { useScores } from '@/next/ndb/hooks/useScores';
import Button from '@/next/ndb/components/Button';
import Icon from '@/next/ndb/components/Icon';
import ScoreListItem from '@/next/ndb/components/setlists/ScoreListItem';
import { downloadSetlist } from '@/next/ndb/api/actions';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/next/ndb/constants';

interface SetlistDisplayProps {
  setlist: SetlistItem;
  onEdit: () => void;
}

const SetlistDisplay: React.FC<SetlistDisplayProps> = ({ setlist, onEdit }) => {
  const { scores } = useScores();

  const getScoreDetails = (scoreId: number) => {
    const score = scores.find((s) => s.id === scoreId);
    return score
      ? {
          title: score.title,
          composer: score.composer,
          arranger: score.arranger,
          instrumentation: score.instrumentation,
        }
      : {
          title: `Score #${scoreId}`,
          composer: 'Unbekannt',
          arranger: null,
          instrumentation: '-',
        };
  };

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
    <div className="max-w-4xl">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{setlist.displayName}</h2>
          <p className="text-sm text-gray-500 mt-1">{setlist.items.length} Noten</p>
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
          Partitur herunterladen
        </Button>
      </div>

      {/* Items List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Noten</h3>
        {setlist.items.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Keine Noten in dieser Setlist
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
            {setlist.items.map((item, index) => {
              const scoreDetails = getScoreDetails(item.score);
              return (
                <div key={`${item.score}-${index}`} className="p-4 flex items-start gap-4">
                  {/* Order number */}
                  <div className="text-base font-medium text-gray-500 w-8 pt-1">{index + 1}.</div>

                  {/* Score details */}
                  <div className="flex-1">
                    <ScoreListItem
                      title={scoreDetails.title}
                      composer={scoreDetails.composer}
                      arranger={scoreDetails.arranger}
                      instrumentation={scoreDetails.instrumentation}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetlistDisplay;
