'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { TopKomentarPostingan } from '../../types';
import { topKomentarColumns } from './top-komentar-columns';

interface TopKomentarTableProps {
  data: TopKomentarPostingan[];
  totalItems: number;
}

export function TopKomentarTable({ data, totalItems }: TopKomentarTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns: topKomentarColumns,
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
