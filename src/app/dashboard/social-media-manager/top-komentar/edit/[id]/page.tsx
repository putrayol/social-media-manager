import PageContainer from '@/components/layout/page-container';
import TopKomentarForm from '@/features/social-media-manager/components/top-komentar-form';
import { headers } from 'next/headers';

interface EditTopKomentarPageProps {
  params: { id: string };
}

export default async function EditTopKomentarPage({
  params
}: EditTopKomentarPageProps) {
  // Fetch data from API (server component)
  const resolvedParams = await Promise.resolve(params);
  const hdrs = await headers();
  const host = hdrs.get('host');
  const protocol = hdrs.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const url = `${baseUrl}/api/social-media-manager/top-komentar/${resolvedParams.id}`;

  let topKomentar: any = null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      topKomentar = json?.data ?? null;
    }
  } catch {
    topKomentar = null;
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
