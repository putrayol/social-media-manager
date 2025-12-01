'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { RequestItem } from '../../types';
import { RequestCellAction } from './request-cell-action';

export const getRequestColumns = (
  isAdmin: boolean
): ColumnDef<RequestItem>[] => {
  const columns: ColumnDef<RequestItem>[] = [
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
      accessorKey: 'tanggalMulai',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tanggal' />
      ),
      cell: ({ row }) => {
        const req = row.original as RequestItem;
        const formatDate = (value?: string | null) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleDateString('id-ID');
        };
        const hasDate = req.tanggalMulai || req.tanggalBerakhir;
        return (
          <div>
            {hasDate
              ? `${formatDate(req.tanggalMulai)}${
                  req.tanggalBerakhir
                    ? ` - ${formatDate(req.tanggalBerakhir)}`
                    : ''
                }`
              : '-'}
          </div>
        );
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
          (req.tiktokPost || 0) +
          (req.tiktokKomen || 0) +
          (req.tiktokLike || 0);
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
    }
  ];

  // Only add actions column for admin users
  if (isAdmin) {
    columns.push({
      id: 'actions',
      header: () => <div className='w-full text-right'>Aksi</div>,
      cell: ({ row }) => <RequestCellAction row={row} />
    });
  }

  return columns;
};

// Keep backward compatibility
export const requestColumns = getRequestColumns(true);
