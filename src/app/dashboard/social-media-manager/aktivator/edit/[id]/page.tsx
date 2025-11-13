'use client';

import PageContainer from '@/components/layout/page-container';
import AktivatorForm from '@/features/social-media-manager/components/aktivator-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function EditAktivatorPage() {
  const params = useParams();
  const id = params?.id as string;
  const [aktivator, setAktivator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/social-media-manager/aktivator/${id}`);
        if (res.ok) {
          const json = await res.json();
          setAktivator(json?.data ?? null);
        } else {
          setAktivator(null);
        }
      } catch (error) {
        console.error('Error fetching aktivator:', error);
        setAktivator(null);
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

  if (!aktivator) {
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
              Edit Social Media Aktivator
            </h2>
            <p className='text-muted-foreground'>
              Ubah data aktivator media sosial
            </p>
          </div>
        </div>

        <AktivatorForm
          pageTitle='Edit Social Media Aktivator'
          initialData={{
            namaAkun: aktivator.namaAkun,
            platform: aktivator.platform,
            jenisKonten: aktivator.jenisKonten,
            link: aktivator.link ?? ''
          }}
        />
      </div>
    </PageContainer>
  );
}
