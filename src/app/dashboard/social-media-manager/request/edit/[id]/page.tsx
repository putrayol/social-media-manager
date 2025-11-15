'use client';

import PageContainer from '@/components/layout/page-container';
import RequestForm from '@/features/social-media-manager/components/request-form';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditRequestPage() {
  const params = useParams();
  const id = params?.id as string;
  const [requestItem, setRequestItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/social-media-manager/request/${id}`);
        if (res.ok) {
          const json = await res.json();
          setRequestItem(json?.data ?? null);
        } else {
          setRequestItem(null);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
        setRequestItem(null);
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

  if (!requestItem) {
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
            <h2 className='text-3xl font-bold tracking-tight'>Edit Request</h2>
            <p className='text-muted-foreground'>Ubah data request</p>
          </div>
        </div>

        <RequestForm
          pageTitle='Edit Request'
          initialData={{
            tanggal: requestItem.tanggal
              ? new Date(requestItem.tanggal).toISOString().slice(0, 10)
              : '',
            namaPaket: requestItem.namaPaket ?? '',
            tiktokPost: requestItem.tiktokPost ?? 0,
            tiktokKomen: requestItem.tiktokKomen ?? 0,
            tiktokLike: requestItem.tiktokLike ?? 0,
            instagramPost: requestItem.instagramPost ?? 0,
            instagramKomen: requestItem.instagramKomen ?? 0,
            instagramLike: requestItem.instagramLike ?? 0,
            facebookPost: requestItem.facebookPost ?? 0,
            facebookKomen: requestItem.facebookKomen ?? 0,
            facebookLike: requestItem.facebookLike ?? 0,
            twitterPost: requestItem.twitterPost ?? 0,
            twitterKomen: requestItem.twitterKomen ?? 0,
            twitterLike: requestItem.twitterLike ?? 0,
            youtubePost: requestItem.youtubePost ?? 0,
            youtubeKomen: requestItem.youtubeKomen ?? 0,
            youtubeLike: requestItem.youtubeLike ?? 0,
            otherPost: requestItem.otherPost ?? 0,
            otherKomen: requestItem.otherKomen ?? 0,
            otherLike: requestItem.otherLike ?? 0,
            bonus: requestItem.bonus ?? ''
          }}
        />
      </div>
    </PageContainer>
  );
}
