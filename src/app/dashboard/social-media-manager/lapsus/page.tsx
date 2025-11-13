'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

export default function LapsusPage() {
  const { organization, isLoaded } = useOrganization();
  const [lapsus, setLapsus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!organization) {
      console.log('[LapsusPage] No organization loaded yet');
      setIsLoading(false);
      return;
    }

    console.log(
      '[LapsusPage] Fetching lapsus for organization:',
      organization.id
    );

    async function fetchLapsus() {
      setIsLoading(true);

      try {
        const res = await fetch('/api/social-media-manager/lapsus');
        if (res.ok) {
          const json = await res.json();
          setLapsus(json.data || json);
        }
      } catch (error) {
        console.error('[LapsusPage] Error fetching lapsus:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLapsus();
  }, [organization, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Laporan Khusus (LAPSUS)
              </h2>
              <p className='text-muted-foreground'>Loading...</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!lapsus) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Laporan Khusus (LAPSUS)
              </h2>
              <p className='text-muted-foreground'>
                Kelola laporan khusus dengan dokumen pendukung
              </p>
            </div>
            <Link href='/dashboard/social-media-manager/lapsus/edit'>
              <Button>
                <Edit className='mr-2 h-4 w-4' />
                Buat Laporan
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className='py-10 text-center'>
              <p className='text-muted-foreground'>Belum ada laporan khusus</p>
            </CardContent>
          </Card>
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
              Laporan Khusus (LAPSUS)
            </h2>
            <p className='text-muted-foreground'>
              Kelola laporan khusus dengan dokumen pendukung
            </p>
          </div>
          <Link href='/dashboard/social-media-manager/lapsus/edit'>
            <Button>
              <Edit className='mr-2 h-4 w-4' />
              Edit Laporan
            </Button>
          </Link>
        </div>

        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Laporan</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Tanggal Laporan
                  </p>
                  <p className='text-lg font-semibold'>
                    {new Date(lapsus.tanggal).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Jumlah Komentar
                  </p>
                  <p className='text-lg font-semibold'>
                    {lapsus.jumlahKomentar || 0}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Jumlah Postingan
                  </p>
                  <p className='text-lg font-semibold'>
                    {lapsus.jumlahPostingan || 0}
                  </p>
                </div>
              </div>

              <div>
                <p className='text-muted-foreground text-sm'>Keterangan</p>
                <p className='mt-2'>{lapsus.keterangan || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dokumen Pendukung</CardTitle>
            </CardHeader>
            <CardContent>
              {lapsus.documentFiles && lapsus.documentFiles.length > 0 ? (
                <div className='space-y-3'>
                  {lapsus.documentFiles.map((file: any) => (
                    <div
                      key={file.id}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div className='flex items-center gap-3'>
                        <FileText className='h-5 w-5 text-blue-600' />
                        <div>
                          <p className='font-medium'>{file.fileName}</p>
                          <p className='text-muted-foreground text-sm'>
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100'
                      >
                        <Download className='h-4 w-4' />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground'>Tidak ada dokumen</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
