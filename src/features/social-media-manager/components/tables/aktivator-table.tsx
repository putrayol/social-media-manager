'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { SocialMediaAktivator } from '../../types';
import { aktivatorColumns } from './aktivator-columns';

interface AktivatorTableProps {
  data: SocialMediaAktivator[];
  totalItems: number;
}

export function AktivatorTable({ data, totalItems }: AktivatorTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns: aktivatorColumns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table}></DataTable>;
}
