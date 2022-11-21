import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table';

import { TableStyled } from './table.styled';

export interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function Table<T>({ columns, data }: TableProps<T>) {
  const { getRowModel, getHeaderGroups } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  const headerGroups = getHeaderGroups();
  const { rows } = getRowModel();

  return (
    <TableStyled>
      <table>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr>
              {headerGroup.headers.map((column) =>
                column.id.includes('hidden') ? null : (
                  <th>
                    {flexRender(
                      column.column.columnDef.header,
                      column.getContext(),
                    )}
                  </th>
                ),
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr>
                {row.getAllCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableStyled>
  );
}
