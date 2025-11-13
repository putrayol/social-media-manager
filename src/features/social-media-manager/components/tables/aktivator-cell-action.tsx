'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { SocialMediaAktivator } from '../../types';
import { useCrudFeedback } from '@/lib/use-crud-feedback';

interface AktivatorCellActionProps {
  row: Row<SocialMediaAktivator>;
}

export function AktivatorCellAction({ row }: AktivatorCellActionProps) {
  const router = useRouter();
  const { run } = useCrudFeedback();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await run(
        async () => {
          const res = await fetch(
            `/api/social-media-manager/aktivator/${row.original.id}`,
            {
              method: 'DELETE'
            }
          );
          if (!res.ok) {
            const err = await res.json().catch(() => null);
            const msg = err?.error || 'Gagal menghapus data aktivator';
            throw new Error(msg);
          }
          return res;
        },
        {
          success: 'Data aktivator berhasil dihapus',
          error: 'Gagal menghapus data aktivator'
        }
      );
      setOpen(false);
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/dashboard/social-media-manager/aktivator/edit/${row.original.id}`
              )
            }
          >
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
