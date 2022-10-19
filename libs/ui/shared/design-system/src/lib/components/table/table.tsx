import { FC } from 'react';
import { useTable, Column } from 'react-table';

import { TableStyled } from './table.styled';

export interface TableProps {
  columns: Column<any>[];
  data: Record<string, any>[];
}

export const Table: FC<TableProps> = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <TableStyled>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) =>
                column.id.includes('hidden') ? null : (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ),
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableStyled>
  );
};
