import PageContainer from '@/components/layout/page-container';
import CyberTroopsForm from '@/features/social-media-manager/components/cyber-troops-form';
import { headers } from 'next/headers';

interface EditCyberTroopsPageProps {
  params: { id: string };
}

export default async function EditCyberTroopsPage({
  params
}: EditCyberTroopsPageProps) {
  // Fetch data from API (server component)
  const hdrs = await headers();
  const host = hdrs.get('host');
  const protocol = hdrs.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const url = `${baseUrl}/api/social-media-manager/cyber-troops/${params.id}`;

  let cyberTroops: any = null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      cyberTroops = json?.data ?? null;
    }
  } catch {
    cyberTroops = null;
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
            keterangan: cyberTroops.keterangan ?? ''
          }}
        />
      </div>
    </PageContainer>
  );
}
