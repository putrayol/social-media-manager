'use client';

import PageContainer from '@/components/layout/page-container';
import { ReportListing } from '@/features/social-media-manager/components/report-listing';
import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

export default function ReportsPage() {
  const { organization, isLoaded } = useOrganization();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch reports function (extracted for reuse)
  const fetchReports = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const res = await fetch('/api/social-media-manager/reports?limit=1000');
      if (res.ok) {
        const json = await res.json();
        const reportsList = Array.isArray(json) ? json : json?.data || [];
        setReports(reportsList);
      }
    } catch (error) {
      console.error('[ReportsPage] Error fetching reports:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // ✅ Initial fetch on mount
  useEffect(() => {
    if (!isLoaded) return;

    if (!organization) {
      console.log('[ReportsPage] No organization loaded yet');
      setIsLoading(false);
      return;
    }

    console.log(
      '[ReportsPage] Fetching reports for organization:',
      organization.id
    );

    fetchReports(true);
  }, [organization, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Laporan Media Sosial
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
              Laporan Media Sosial
            </h2>
            <p className='text-muted-foreground'>
              Kelola semua laporan aktivitas media sosial Anda
            </p>
          </div>
        </div>

        <ReportListing
          reports={reports}
          onRefresh={() => fetchReports(false)}
        />
      </div>
    </PageContainer>
  );
}
