import PageContainer from '@/components/layout/page-container';
import { ReportListing } from '@/features/social-media-manager/components/report-listing';
import { mockReports } from '@/features/social-media-manager/utils/mock-reports';

export default async function ReportsPage() {
  // TODO: Fetch data from API
  const reports = mockReports;

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

        <ReportListing reports={reports} />
      </div>
    </PageContainer>
  );
}
