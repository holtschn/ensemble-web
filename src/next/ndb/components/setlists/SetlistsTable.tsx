import React from 'react';
import { SetlistItem } from '@/next/ndb/types';
import Table, { TableColumn } from '@/next/ndb/components/Table';
import ScrollableTable from '@/next/ndb/components/ScrollableTable';
import Icon from '@/next/ndb/components/Icon';
import { downloadSetlist } from '@/next/ndb/api/actions';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/next/ndb/constants';

interface SetlistsTableProps {
  setlists: SetlistItem[];
  onSetlistClick?: (setlist: SetlistItem) => void;
  onRefetch?: () => void;
  className?: string;
}

const SetlistsTable: React.FC<SetlistsTableProps> = ({ setlists, onSetlistClick, onRefetch, className = '' }) => {
  const handleDownload = async (e: React.MouseEvent, setlist: SetlistItem, fileType: 'parts' | 'fullScore') => {
    e.stopPropagation(); // Prevent row click

    try {
      toast.info(SUCCESS_MESSAGES.SETLIST_DOWNLOADED);
      const result = await downloadSetlist({
        setlistId: setlist.id,
        fileType,
      });

      if (result?.url) {
        // Open download URL in new tab
        window.open(result.url, '_blank');
      }
    } catch (error) {
      toast.error('Fehler beim Herunterladen der Setlist');
      console.error('Download error:', error);
    }
  };

  const columns: TableColumn<SetlistItem>[] = [
    {
      key: 'displayName',
      header: 'Name',
      className: 'font-medium',
      render: (value) => value || '-',
    },
    {
      key: 'items',
      header: 'Anzahl Stücke',
      className: 'text-center',
      render: (value) => (value as any[])?.length || 0,
    },
    {
      key: 'id',
      header: 'Aktionen',
      className: 'text-center',
      render: (_, row) => (
        <div className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => handleDownload(e, row, 'parts')}
            className="btn-secondary btn-sm"
            title="Alle Stimmen herunterladen"
          >
            <Icon name="download" alt="Download Stimmen" className="h-3 w-3 inline mr-1" />
            alle Stimmen
          </button>
          <button
            onClick={(e) => handleDownload(e, row, 'fullScore')}
            className="btn-secondary btn-sm"
            title="Alle Partituren herunterladen"
          >
            <Icon name="download" alt="Download Partitur" className="h-3 w-3 inline mr-1" />
            alle Partituren
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={className}>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table
          data={setlists}
          columns={columns}
          keyExtractor={(setlist) => setlist.id.toString()}
          emptyMessage="Keine Setlists gefunden"
          onRowClick={onSetlistClick}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="space-y-3">
          {setlists.map((setlist) => (
            <div
              key={setlist.id}
              onClick={() => onSetlistClick?.(setlist)}
              className="bg-white border-base rounded-card p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-neutral-900">{setlist.displayName}</h3>
                <span className="text-neutral-400 flex-shrink-0 ml-2">→</span>
              </div>
              <div className="text-muted mb-3">{setlist.items.length} Stücke</div>
              <div className="flex gap-2">
                <button onClick={(e) => handleDownload(e, setlist, 'parts')} className="btn-secondary btn-sm flex-1">
                  <Icon name="download" alt="Download" className="h-3 w-3 inline mr-1" />
                  alle Stimmen
                </button>
                <button
                  onClick={(e) => handleDownload(e, setlist, 'fullScore')}
                  className="btn-secondary btn-sm flex-1"
                  title="Alle Partituren herunterladen"
                >
                  <Icon name="download" alt="Download" className="h-3 w-3 inline mr-1" />
                  alle Partituren
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetlistsTable;
