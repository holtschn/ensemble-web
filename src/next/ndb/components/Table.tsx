import React from 'react';

interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  renderHeader?: () => React.ReactNode; // Custom header content (e.g., with filters)
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

const Table = <T,>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Tabelle ist leer',
  className = '',
  onRowClick,
}: TableProps<T>) => {
  const getValue = (row: T, key: keyof T | string): any => {
    if (typeof key === 'string' && key.includes('.')) {
      // Handle nested keys like 'user.name'
      return key.split('.').reduce((obj, k) => obj?.[k], row as any);
    }
    return row[key as keyof T];
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <table className="table max-w-7xl">
        <thead className="table-header">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`table-header-cell ${column.className || ''} ${column.headerClassName || ''}`.trim()}
              >
                {column.renderHeader ? column.renderHeader() : column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-8 text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={`table-row ${onRowClick ? 'table-row-clickable' : ''}`.trim()}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => {
                  const value = getValue(row, column.key);
                  return (
                    <td
                      key={colIndex}
                      className={`table-cell ${column.className || ''}`.trim()}
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
export type { TableColumn };
