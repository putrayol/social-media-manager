'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { RequestItem } from '../../types';
import { requestColumns } from './request-columns';

interface RequestTableProps {
  data: RequestItem[];
  totalItems: number;
}

export function RequestTable({ data, totalItems }: RequestTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize || 1);

  const { table } = useDataTable({
    data,
    columns: requestColumns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
