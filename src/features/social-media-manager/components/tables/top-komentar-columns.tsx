'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import { TopKomentarPostingan } from '../../types';
import { TopKomentarCellAction } from './top-komentar-cell-action';

export const topKomentarColumns: ColumnDef<TopKomentarPostingan>[] = [
  {
    accessorKey: 'no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No' />
    ),
    cell: ({ row }) => <div className='w-8'>{row.getValue('no')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'namaAkun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Akun' />
    ),
    cell: ({ row }) => <div>{row.getValue('namaAkun')}</div>
  },
  {
    accessorKey: 'platform',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Platform' />
    ),
    cell: ({ row }) => {
      const platform = row.getValue('platform') as string;
      return (
        <Badge variant='outline' className='capitalize'>
          {platform.toLowerCase()}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'jumlahTopKomentar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Top Komentar' />
    ),
    cell: ({ row }) => <div>{row.getValue('jumlahTopKomentar')}</div>
  },
  {
    accessorKey: 'link',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Link' />
    ),
    cell: ({ row }) => {
      const link = row.getValue('link') as string;
      return (
        <a
          href={link}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-blue-600 hover:underline'
        >
          <ExternalLink className='h-4 w-4' />
          Buka
        </a>
      );
    }
  },
  {
    accessorKey: 'keterangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Keterangan' />
    ),
    cell: ({ row }) => <div>{row.getValue('keterangan') || '-'}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <TopKomentarCellAction row={row} />
  }
];
