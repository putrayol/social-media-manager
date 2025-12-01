'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, User, MessageSquare, Heart } from 'lucide-react';
import { TopKomentarPostingan } from '../../types';
import { TopKomentarCellAction } from './top-komentar-cell-action';
import { SocialPreviewButton } from '../social-embed-modal';

export const getTopKomentarColumns = (
  isAdmin: boolean
): ColumnDef<TopKomentarPostingan>[] => {
  const columns: ColumnDef<TopKomentarPostingan>[] = [
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
        <DataTableColumnHeader column={column} title='Info Top Komentar' />
      ),
      cell: ({ row }) => {
        const item = row.original as TopKomentarPostingan;
        const link = item.link;
        const linkProfile = item.linkProfile;

        return (
          <div className='flex flex-col gap-1.5 py-1'>
            {/* Account Name & Platform */}
            <div className='flex items-center gap-2'>
              <span className='font-medium'>{item.namaAkun}</span>
              <Badge variant='outline' className='text-xs capitalize'>
                {item.platform.toLowerCase()}
              </Badge>
            </div>

            {/* Stats: Top Comments & Likes */}
            <div className='text-muted-foreground flex items-center gap-3 text-xs'>
              <span className='flex items-center gap-1'>
                <MessageSquare className='h-3.5 w-3.5' />
                Top: {item.jumlahTopKomentar}
              </span>
              <span className='flex items-center gap-1'>
                <Heart className='h-3.5 w-3.5' />
                {item.jumlahLike}
              </span>
            </div>

            {/* Keterangan */}
            {item.keterangan && (
              <span className='text-muted-foreground text-xs'>
                {item.keterangan}
              </span>
            )}

            {/* Links */}
            <div className='flex flex-wrap items-center gap-3'>
              {linkProfile && (
                <div className='flex items-center gap-1'>
                  <SocialPreviewButton
                    url={linkProfile}
                    platform={item.platform}
                    title={`Profile: ${item.namaAkun}`}
                  />
                  <a
                    href={linkProfile}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
                  >
                    <User className='h-3.5 w-3.5' />
                    Profile
                  </a>
                </div>
              )}
              {link && (
                <div className='flex items-center gap-1'>
                  <SocialPreviewButton
                    url={link}
                    platform={item.platform}
                    title={`Postingan: ${item.namaAkun}`}
                  />
                  <a
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
                  >
                    <ExternalLink className='h-3.5 w-3.5' />
                    Postingan
                  </a>
                </div>
              )}
            </div>
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
      cell: ({ row }) => <TopKomentarCellAction row={row} />
    });
  }

  return columns;
};

// Keep backward compatibility
export const topKomentarColumns = getTopKomentarColumns(true);
