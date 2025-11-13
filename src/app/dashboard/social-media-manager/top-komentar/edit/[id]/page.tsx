'use client';

import PageContainer from '@/components/layout/page-container';
import TopKomentarForm from '@/features/social-media-manager/components/top-komentar-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function EditTopKomentarPage() {
  const params = useParams();
  const id = params?.id as string;
  const [topKomentar, setTopKomentar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/social-media-manager/top-komentar/${id}`);
        if (res.ok) {
          const json = await res.json();
          setTopKomentar(json?.data ?? null);
        } else {
          setTopKomentar(null);
        }
      } catch (error) {
        console.error('Error fetching top komentar:', error);
        setTopKomentar(null);
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

  if (!topKomentar) {
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
              Edit Top Komentar Postingan
            </h2>
            <p className='text-muted-foreground'>
              Ubah data top komentar postingan
            </p>
          </div>
        </div>

        <TopKomentarForm
          pageTitle='Edit Top Komentar Postingan'
          initialData={{
            namaAkun: topKomentar.namaAkun,
            platform: topKomentar.platform,
            jumlahTopKomentar: topKomentar.jumlahTopKomentar,
            link: topKomentar.link ?? '',
            keterangan: topKomentar.keterangan ?? '',
            documentFiles: topKomentar.documentFiles ?? []
          }}
        />
      </div>
    </PageContainer>
  );
}
