'use client';

import PageContainer from '@/components/layout/page-container';
import CyberTroopsForm from '@/features/social-media-manager/components/cyber-troops-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function EditCyberTroopsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [cyberTroops, setCyberTroops] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/social-media-manager/cyber-troops/${id}`);
        if (res.ok) {
          const json = await res.json();
          setCyberTroops(json?.data ?? null);
        } else {
          setCyberTroops(null);
        }
      } catch (error) {
        console.error('Error fetching cyber troops:', error);
        setCyberTroops(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col items-center justify-center space-y-4'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (!cyberTroops) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Data tidak ditemukan</h2>
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
            <h2 className='text-3xl font-bold tracking-tight'>
              Edit Cyber Troops
            </h2>
            <p className='text-muted-foreground'>Ubah data cyber troops</p>
          </div>
        </div>

        <CyberTroopsForm
          pageTitle='Edit Cyber Troops'
          initialData={{
            namaAkun: cyberTroops.namaAkun,
            platform: cyberTroops.platform,
            kategori: cyberTroops.kategori,
            jenisIsu: cyberTroops.jenisIsu,
            jumlahKomentar: cyberTroops.jumlahKomentar,
            link: cyberTroops.link ?? '',
            keterangan: cyberTroops.keterangan ?? '',
            requestId: cyberTroops.requestId ?? null
          }}
        />
      </div>
    </PageContainer>
  );
}
