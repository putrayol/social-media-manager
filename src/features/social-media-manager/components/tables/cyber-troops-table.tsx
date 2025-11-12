'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { CyberTroops } from '../../types';
import { cyberTroopsColumns } from './cyber-troops-columns';

interface CyberTroopsTableProps {
  data: CyberTroops[];
  totalItems: number;
}

export function CyberTroopsTable({ data, totalItems }: CyberTroopsTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns: cyberTroopsColumns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
