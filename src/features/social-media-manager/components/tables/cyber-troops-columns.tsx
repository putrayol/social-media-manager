'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import { CyberTroops } from '../../types';
import { CyberTroopsCellAction } from './cyber-troops-cell-action';

export const cyberTroopsColumns: ColumnDef<CyberTroops>[] = [
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
    accessorKey: 'kategori',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kategori' />
    ),
    cell: ({ row }) => {
      const kategori = row.getValue('kategori') as string;
      return (
        <Badge variant={kategori === 'Positif' ? 'default' : 'destructive'}>
          {kategori}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'jenisIsu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Isu' />
    ),
    cell: ({ row }) => <div>{row.getValue('jenisIsu')}</div>
  },
  {
    accessorKey: 'jumlahKomentar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Komentar' />
    ),
    cell: ({ row }) => <div>{row.getValue('jumlahKomentar')}</div>
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
    id: 'actions',
    cell: ({ row }) => <CyberTroopsCellAction row={row} />
  }
];
