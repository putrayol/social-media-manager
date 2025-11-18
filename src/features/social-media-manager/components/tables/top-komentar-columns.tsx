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
    size: 64,
    minSize: 48,
    maxSize: 80,
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
    cell: ({ row }) => {
      const item = row.original as TopKomentarPostingan;
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-sm font-medium'>{item.namaAkun}</span>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <span>Platform :</span>
            <Badge variant='outline' className='capitalize'>
              {item.platform.toLowerCase()}
            </Badge>
          </div>
          <span className='text-muted-foreground text-xs'>
            Top Komentar: {item.jumlahTopKomentar} • Like: {item.jumlahLike}
          </span>
          <span className='text-muted-foreground text-xs'>
            Keterangan: {item.keterangan || '-'}
          </span>
        </div>
      );
    }
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
    header: () => <div className='w-full text-right'>Aksi</div>,
    cell: ({ row }) => <TopKomentarCellAction row={row} />
  }
];
