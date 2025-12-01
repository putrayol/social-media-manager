'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, Users, MessageSquare, Heart } from 'lucide-react';
import { SocialMediaAktivator } from '../../types';
import { AktivatorCellAction } from './aktivator-cell-action';
import { SocialPreviewButton } from '../social-embed-modal';

export const getAktivatorColumns = (
  isAdmin: boolean
): ColumnDef<SocialMediaAktivator>[] => {
  const columns: ColumnDef<SocialMediaAktivator>[] = [
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
        <DataTableColumnHeader column={column} title='Info Aktivator' />
      ),
      cell: ({ row }) => {
        const item = row.original as SocialMediaAktivator;
        const link = item.link;
        const cyberTroopsCount = item.cyberTroops?.length || 0;
        const totalKomentar = item.totalKomentar || 0;
        const totalLike = item.totalLike || 0;

        return (
          <div className='flex flex-col gap-1.5 py-1'>
            {/* Account Name & Platform */}
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>{item.namaAkun}</span>
              <Badge variant='outline' className='text-xs capitalize'>
                {item.platform.toLowerCase()}
              </Badge>
            </div>

            {/* Stats: Cyber Troops, Comments, Likes */}
            <div className='text-muted-foreground flex flex-wrap items-center gap-3 text-sm'>
              <span className='flex items-center gap-1'>
                <Users className='h-3 w-3' />
                {cyberTroopsCount} Troops
              </span>
              <span className='flex items-center gap-1'>
                <MessageSquare className='h-3 w-3' />
                {totalKomentar}
              </span>
              <span className='flex items-center gap-1'>
                <Heart className='h-3 w-3' />
                {totalLike}
              </span>
            </div>

            {/* Link Profile */}
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
      cell: ({ row }) => <AktivatorCellAction row={row} />
    });
  }

  return columns;
};

// Keep backward compatibility
export const aktivatorColumns = getAktivatorColumns(true);
