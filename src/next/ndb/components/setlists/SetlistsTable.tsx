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
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
            title="Stimmen herunterladen"
          >
            <Icon name="download" alt="Download Stimmen" className="h-3 w-3 inline mr-1" />
            Stimmen
          </button>
          <button
            onClick={(e) => handleDownload(e, row, 'fullScore')}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
            title="Partituren herunterladen"
          >
            <Icon name="download" alt="Download Partitur" className="h-3 w-3 inline mr-1" />
            Partitur
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={className}>
      {/* Desktop view */}
      <div className="hidden md:block">
        <ScrollableTable>
          <Table
            className="mx-4"
            data={setlists}
            columns={columns}
            keyExtractor={(setlist) => setlist.id.toString()}
            emptyMessage="Keine Setlists gefunden"
            onRowClick={onSetlistClick}
          />
        </ScrollableTable>
      </div>

      {/* Mobile view */}
      <div className="md:hidden middle-column">
        <div className="space-y-3">
          {setlists.map((setlist) => (
            <div
              key={setlist.id}
              onClick={() => onSetlistClick?.(setlist)}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{setlist.displayName}</h3>
                <span className="text-gray-400 flex-shrink-0 ml-2">→</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">{setlist.items.length} Stücke</div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleDownload(e, setlist, 'parts')}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                >
                  <Icon name="download" alt="Download" className="h-3 w-3 inline mr-1" />
                  Stimmen
                </button>
                <button
                  onClick={(e) => handleDownload(e, setlist, 'fullScore')}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  title="Partituren herunterladen"
                >
                  <Icon name="download" alt="Download" className="h-3 w-3 inline mr-1" />
                  Partitur
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
