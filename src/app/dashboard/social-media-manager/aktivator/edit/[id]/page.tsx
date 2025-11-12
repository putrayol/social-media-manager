import PageContainer from '@/components/layout/page-container';
import AktivatorForm from '@/features/social-media-manager/components/aktivator-form';
import { headers } from 'next/headers';

interface EditAktivatorPageProps {
  params: { id: string };
}

export default async function EditAktivatorPage({
  params
}: EditAktivatorPageProps) {
  const hdrs = await headers();
  const host = hdrs.get('host') || 'localhost:3002';
  const protocol = hdrs.get('x-forwarded-proto') || 'http';
  const origin = `${protocol}://${host}`;

  let aktivator: any | null = null;
  try {
    const res = await fetch(
      `${origin}/api/social-media-manager/aktivator/${params.id}`,
      {
        cache: 'no-store'
      }
    );
    const json = await res.json().catch(() => null);
    if (res.ok && json?.success) {
      aktivator = json.data;
    }
  } catch {}

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
