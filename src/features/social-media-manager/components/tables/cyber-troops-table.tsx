'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useOrganizationAuth } from '@/hooks/use-organization-auth';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { CyberTroops } from '../../types';
import { getCyberTroopsColumns } from './cyber-troops-columns';

interface CyberTroopsTableProps {
  data: CyberTroops[];
  totalItems: number;
}

export function CyberTroopsTable({ data, totalItems }: CyberTroopsTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const { isAdmin } = useOrganizationAuth();

  const columns = useMemo(() => getCyberTroopsColumns(isAdmin), [isAdmin]);
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table}></DataTable>;
}
