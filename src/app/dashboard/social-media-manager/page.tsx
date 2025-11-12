import PageContainer from '@/components/layout/page-container';
import { SocialMediaListing } from '@/features/social-media-manager/components/social-media-listing';
import { headers } from 'next/headers';

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

export default async function SocialMediaManagerPage() {
  const hdrs = await headers();
  const host = hdrs.get('host') || 'localhost:3002';
  const protocol = hdrs.get('x-forwarded-proto') || 'http';
  const origin = `${protocol}://${host}`;
  // Fetch Aktivator via API proxy to backend
  let aktivatorData = [] as any[];
  let totalAktivator = 0;
  try {
    const res = await fetch(
      `${origin}/api/social-media-manager/aktivator?limit=1000`,
      {
        cache: 'no-store'
      }
    );
    const json = await res.json().catch(() => null);
    if (res.ok && json) {
      const { list, total } = extractListAndTotal(json);
      aktivatorData = list;
      totalAktivator = total;
    } else {
      aktivatorData = [];
      totalAktivator = 0;
    }
  } catch (e) {
    aktivatorData = [];
    totalAktivator = 0;
  }
  // Fetch Cyber Troops
  let cyberTroopsData = [] as any[];
  let totalCyber = 0;
  try {
    const res = await fetch(
      `${origin}/api/social-media-manager/cyber-troops?limit=1000`,
      {
        cache: 'no-store'
      }
    );
    const json = await res.json().catch(() => null);
    if (res.ok && json) {
      const { list, total } = extractListAndTotal(json);
      cyberTroopsData = list;
      totalCyber = total;
    }
  } catch {}

  // Fetch Top Komentar
  let topKomentarData = [] as any[];
  let totalTopKomentar = 0;
  try {
    const res = await fetch(
      `${origin}/api/social-media-manager/top-komentar?limit=1000`,
      {
        cache: 'no-store'
      }
    );
    const json = await res.json().catch(() => null);
    if (res.ok && json) {
      const { list, total } = extractListAndTotal(json);
      topKomentarData = list;
      totalTopKomentar = total;
    }
  } catch {}

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Social Media Manager
            </h2>
            <p className='text-muted-foreground'>
              Kelola laporan aktivitas media sosial Anda
            </p>
          </div>
        </div>

        <SocialMediaListing
          aktivatorData={aktivatorData}
          cyberTroopsData={cyberTroopsData}
          topKomentarData={topKomentarData}
          totalAktivator={totalAktivator}
          totalCyberTroops={totalCyber}
          totalTopKomentar={totalTopKomentar}
        />
      </div>
    </PageContainer>
  );
}
