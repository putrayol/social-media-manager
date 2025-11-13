'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import ReportForm from '@/features/social-media-manager/components/report-form';

interface EditReportPageProps {
  params: Promise<{ id: string }>;
}

export default function EditReportPage({ params }: EditReportPageProps) {
  const { organization, isLoaded } = useOrganization();
  const [report, setReport] = useState<any>(null);
  const [reportId, setReportId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    params.then(({ id }) => setReportId(id));
  }, [params]);

  // Fetch report data
  useEffect(() => {
    if (!isLoaded || !reportId || !organization) return;

    async function fetchReport() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/social-media-manager/reports/${reportId}`
        );
        const data = await res.json();

        if (data.success) {
          // Convert date strings to Date objects
          const reportData = {
            ...data.data,
            tanggal: data.data.tanggal
              ? new Date(data.data.tanggal)
              : new Date(),
            lapsus: data.data.lapsus
              ? {
                  ...data.data.lapsus,
                  tanggal: data.data.lapsus.tanggal
                    ? new Date(data.data.lapsus.tanggal)
                    : new Date()
                }
              : undefined
          };
          setReport(reportData);
        } else {
          setError('Laporan tidak ditemukan');
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Gagal memuat data laporan');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [organization, isLoaded, reportId]);

  if (!isLoaded || loading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='text-center'>
            <p>Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !report) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>
              {error || 'Laporan tidak ditemukan'}
            </h2>
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
              Edit Laporan {report.reportNo}
            </h2>
            <p className='text-muted-foreground'>
              Ubah data laporan media sosial
            </p>
          </div>
        </div>

        <ReportForm
          pageTitle={`Edit Laporan ${report.reportNo}`}
          initialData={report}
        />
      </div>
    </PageContainer>
  );
}
