'use client';

import PageContainer from '@/components/layout/page-container';
import { SocialMediaListing } from '@/features/social-media-manager/components/social-media-listing';
import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

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

export default function SocialMediaManagerPage() {
  const { organization, isLoaded } = useOrganization();
  const [aktivatorData, setAktivatorData] = useState<any[]>([]);
  const [totalAktivator, setTotalAktivator] = useState(0);
  const [cyberTroopsData, setCyberTroopsData] = useState<any[]>([]);
  const [totalCyber, setTotalCyber] = useState(0);
  const [topKomentarData, setTopKomentarData] = useState<any[]>([]);
  const [totalTopKomentar, setTotalTopKomentar] = useState(0);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [totalRequest, setTotalRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch data function (extracted for reuse)
  const fetchData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      // Fetch Aktivator
      const aktivatorRes = await fetch(
        '/api/social-media-manager/aktivator?limit=1000'
      );
      if (aktivatorRes.ok) {
        const json = await aktivatorRes.json();
        const { list, total } = extractListAndTotal(json);
        setAktivatorData(list);
        setTotalAktivator(total);
      }

      // Fetch Cyber Troops
      const cyberRes = await fetch(
        '/api/social-media-manager/cyber-troops?limit=1000'
      );
      if (cyberRes.ok) {
        const json = await cyberRes.json();
        const { list, total } = extractListAndTotal(json);
        setCyberTroopsData(list);
        setTotalCyber(total);
      }

      // Fetch Top Komentar
      const topKomentarRes = await fetch(
        '/api/social-media-manager/top-komentar?limit=1000'
      );
      if (topKomentarRes.ok) {
        const json = await topKomentarRes.json();
        const { list, total } = extractListAndTotal(json);
        setTopKomentarData(list);
        setTotalTopKomentar(total);
      }

      // Fetch Request
      const requestRes = await fetch(
        '/api/social-media-manager/request?limit=1000'
      );
      if (requestRes.ok) {
        const json = await requestRes.json();
        const { list, total } = extractListAndTotal(json);
        setRequestData(list);
        setTotalRequest(total);
      }
    } catch (error) {
      console.error('[SocialMediaManagerPage] Error fetching data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // ✅ Initial fetch on mount
  useEffect(() => {
    if (!isLoaded) return;

    if (!organization) {
      console.log('[SocialMediaManagerPage] No organization loaded yet');
      setIsLoading(false);
      return;
    }

    console.log(
      '[SocialMediaManagerPage] Fetching data for organization:',
      organization.id
    );

    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Social Media Manager
              </h2>
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
          requestData={requestData}
          totalAktivator={totalAktivator}
          totalCyberTroops={totalCyber}
          totalTopKomentar={totalTopKomentar}
          totalRequest={totalRequest}
          onRefresh={() => fetchData(false)}
        />
      </div>
    </PageContainer>
  );
}
