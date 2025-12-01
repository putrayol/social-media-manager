'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCrudFeedback } from '@/lib/use-crud-feedback';
import { Row } from '@tanstack/react-table';
import { CyberTroops } from '../../types';
import { useOrganizationAuth } from '@/hooks/use-organization-auth';

interface CyberTroopsCellActionProps {
  row: Row<CyberTroops>;
}

export function CyberTroopsCellAction({ row }: CyberTroopsCellActionProps) {
  const router = useRouter();
  const { run } = useCrudFeedback();
  const { isAdmin } = useOrganizationAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await run(
        async () => {
          const res = await fetch(
            `/api/social-media-manager/cyber-troops/${row.original.id}`,
            {
              method: 'DELETE'
            }
          );
          if (!res.ok) {
            const err = await res.json().catch(() => null);
            const msg = err?.error || 'Gagal menghapus data cyber troops';
            throw new Error(msg);
          }
          return res;
        },
        {
          success: 'Data cyber troops berhasil dihapus',
          error: 'Gagal menghapus data cyber troops'
        }
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show action buttons for admin users
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className='flex justify-end gap-2'>
        <Button
          size='sm'
          variant='ghost'
          onClick={() =>
            router.push(
              `/dashboard/social-media-manager/cyber-troops/edit/${row.original.id}`
            )
          }
        >
          <Edit className='h-4 w-4' />
          <span className='sr-only'>Edit</span>
        </Button>
        <Button size='sm' variant='ghost' onClick={() => setOpen(true)}>
          <Trash className='h-4 w-4 text-red-600' />
          <span className='sr-only'>Hapus</span>
        </Button>
      </div>
    </>
  );
}
