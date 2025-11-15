'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { RequestTable } from '@/features/social-media-manager/components/tables/request-table';
import { useOrganization } from '@clerk/nextjs';
import { RotateCw, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function extractListAndTotal(json: any) {
  const list = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.results)
        ? json.results
        : Array.isArray(json?.items)
          ? json.items
          : [];

  const total =
    typeof json?.total === 'number'
      ? json.total
      : typeof json?.count === 'number'
        ? json.count
        : list.length;

  return { list, total };
}

export default function RequestListPage() {
  const { organization, isLoaded } = useOrganization();
  const [requestData, setRequestData] = useState<any[]>([]);
  const [totalRequest, setTotalRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRequests = async (showLoading = true) => {
    if (!organization) {
      if (showLoading) {
        setIsLoading(false);
      }
      console.warn(
        '[RequestListPage] Tried to fetch requests without organization'
      );
      toast.error(
        'Silakan pilih organisasi terlebih dahulu sebelum mengakses data Request'
      );
      setRequestData([]);
      setTotalRequest(0);
      return;
    }

    if (showLoading) setIsLoading(true);

    try {
      const res = await fetch('/api/social-media-manager/request?limit=1000');
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const apiMessage =
          (json as any)?.error ||
          (json as any)?.message ||
          (json as any)?.detail;
        const isOrgError =
          res.status === 403 &&
          typeof apiMessage === 'string' &&
          apiMessage.toLowerCase().includes('organization');

        const message = isOrgError
          ? 'Silakan pilih organisasi terlebih dahulu sebelum mengakses data Request'
          : apiMessage || 'Gagal memuat data Request';

        // Gunakan console.warn dan hanya di non-production agar tidak muncul sebagai error di console
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[RequestListPage] Failed to fetch requests:', {
            status: res.status,
            statusText: res.statusText,
            body: json
          });
        }

        toast.error(message);
        setRequestData([]);
        setTotalRequest(0);
        return;
      }

      const { list, total } = extractListAndTotal(json);
      setRequestData(list);
      setTotalRequest(total);
    } catch (error) {
      console.error('[RequestListPage] Error fetching requests:', error);
      toast.error('Terjadi kesalahan saat memuat data Request');
      setRequestData([]);
      setTotalRequest(0);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!organization) {
      console.log('[RequestListPage] No organization loaded yet');
      setIsLoading(false);
      return;
    }

    console.log(
      '[RequestListPage] Fetching requests for organization:',
      organization.id
    );

    fetchRequests(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id, isLoaded]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRequests(false);
    // Reset after a short delay to show the animation
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!isLoaded || isLoading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>Request</h2>
              <p className='text-muted-foreground'>Loading...</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>Request</h2>
            <p className='text-muted-foreground'>
              Kelola semua data request paket aktivitas media sosial Anda
            </p>
          </div>
        </div>

        <div className='mt-2 space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Daftar Request</h3>
            <div className='bg-background flex gap-1 rounded-lg border p-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='gap-2'
              >
                <RotateCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Link href='/dashboard/social-media-manager/request/create'>
                <Button variant='ghost' size='sm' className='gap-2'>
                  <Plus className='h-4 w-4' />
                  Tambah Data
                </Button>
              </Link>
            </div>
          </div>

          {requestData.length === 0 ? (
            <div className='rounded-lg border py-8 text-center'>
              <p className='text-muted-foreground mb-4'>
                Belum ada data Request. Silakan tambah Request terlebih dahulu.
              </p>
              <Link href='/dashboard/social-media-manager/request/create'>
                <Button>Tambah Request Pertama</Button>
              </Link>
            </div>
          ) : (
            <RequestTable data={requestData} totalItems={totalRequest} />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
