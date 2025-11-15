'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { RequestItem } from '../../types';
import { RequestCellAction } from './request-cell-action';

export const requestColumns: ColumnDef<RequestItem>[] = [
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
    accessorKey: 'namaPaket',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Paket' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('namaPaket') as string;
      return <div className='font-medium'>{value}</div>;
    }
  },
  {
    accessorKey: 'tanggal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('tanggal') as string;
      const date = value ? new Date(value) : null;
      return <div>{date ? date.toLocaleDateString('id-ID') : '-'}</div>;
    }
  },
  {
    id: 'tiktokTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TikTok Total' />
    ),
    cell: ({ row }) => {
      const req = row.original;
      const total =
        (req.tiktokPost || 0) + (req.tiktokKomen || 0) + (req.tiktokLike || 0);
      return <div>{total}</div>;
    }
  },
  {
    id: 'instagramTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Instagram Total' />
    ),
    cell: ({ row }) => {
      const req = row.original;
      const total =
        (req.instagramPost || 0) +
        (req.instagramKomen || 0) +
        (req.instagramLike || 0);
      return <div>{total}</div>;
    }
  },
  {
    id: 'facebookTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Facebook Total' />
    ),
    cell: ({ row }) => {
      const req = row.original;
      const total =
        (req.facebookPost || 0) +
        (req.facebookKomen || 0) +
        (req.facebookLike || 0);
      return <div>{total}</div>;
    }
  },
  {
    id: 'twitterTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Twitter / X Total' />
    ),
    cell: ({ row }) => {
      const req = row.original;
      const total =
        (req.twitterPost || 0) +
        (req.twitterKomen || 0) +
        (req.twitterLike || 0);
      return <div>{total}</div>;
    }
  },
  {
    id: 'youtubeTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='YouTube Total' />
    ),
    cell: ({ row }) => {
      const req = row.original;
      const total =
        (req.youtubePost || 0) +
        (req.youtubeKomen || 0) +
        (req.youtubeLike || 0);
      return <div>{total}</div>;
    }
  },
  {
    id: 'otherTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lainnya Total' />
    ),
    cell: ({ row }) => {
      const req = row.original;
      const total =
        (req.otherPost || 0) + (req.otherKomen || 0) + (req.otherLike || 0);
      return <div>{total}</div>;
    }
  },
  {
    accessorKey: 'bonus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bonus' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('bonus') as string | null;
      return <div className='max-w-xs truncate'>{value || '-'}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <RequestCellAction row={row} />
  }
];
