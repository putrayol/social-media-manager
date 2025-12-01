'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, User, MessageSquare, Heart } from 'lucide-react';
import { CyberTroops } from '../../types';
import { CyberTroopsCellAction } from './cyber-troops-cell-action';
import { SocialPreviewButton } from '../social-embed-modal';

export const getCyberTroopsColumns = (
  isAdmin: boolean
): ColumnDef<CyberTroops>[] => {
  const columns: ColumnDef<CyberTroops>[] = [
    {
      accessorKey: 'no',
      size: 50,
      minSize: 40,
      maxSize: 60,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='No' />
      ),
      cell: ({ row }) => (
        <div className='w-6 text-center'>{row.getValue('no')}</div>
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'namaAkun',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Info Cyber Troops' />
      ),
      cell: ({ row }) => {
        const item = row.original as CyberTroops;
        const namaAkun = item.aktivator?.namaAkun || item.namaAkun;
        const platform = item.aktivator?.platform || item.platform;
        const link = item.link;
        const kategoriVariant =
          item.kategori === 'Positif' ? 'default' : 'destructive';

        return (
          <div className='flex flex-col gap-1.5 py-1'>
            {/* Account Name & Platform */}
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>{namaAkun}</span>
              <Badge variant='outline' className='text-xs capitalize'>
                {platform.toLowerCase()}
              </Badge>
              |
              <Badge variant={kategoriVariant} className='text-xs'>
                {item.kategori}
              </Badge>
            </div>

            {/* Category & Issue */}
            <div className='flex flex-wrap items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>
                Isu: {item.jenisIsu}
              </span>
            </div>

            {/* Stats: Comments & Likes */}
            <div className='text-muted-foreground flex items-center gap-3 text-sm'>
              <span className='flex items-center gap-1'>
                <MessageSquare className='h-3.5 w-3.5' />
                {item.jumlahKomentar}
              </span>
              <span className='flex items-center gap-1'>
                <Heart className='h-3.5 w-3.5' />
                {item.jumlahLike}
              </span>
            </div>

            {/* Link Postingan */}
            {link && (
              <div className='flex items-center gap-2'>
                <a
                  href={link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
                >
                  <ExternalLink className='h-3.5 w-3.5' />
                  Buka
                </a>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  // Only add actions column for admin users
  if (isAdmin) {
    columns.push({
      id: 'actions',
      size: 60,
      header: () => <div className='w-full text-right'>Aksi</div>,
      cell: ({ row }) => <CyberTroopsCellAction row={row} />
    });
  }

  return columns;
};

// Keep backward compatibility
export const cyberTroopsColumns = getCyberTroopsColumns(true);
