import PageContainer from '@/components/layout/page-container';
import { ReportListing } from '@/features/social-media-manager/components/report-listing';
import { prisma } from '@/lib/prisma';

export default async function ReportsPage() {
  // Fetch data from database
  const reports = await prisma.socialMediaReport.findMany({
    include: {
      aktivator: true,
      cyberTroops: true,
      topKomentar: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Transform data to match SocialMediaReport interface
  const transformedReports = reports.map((report) => ({
    ...report,
    lapsus: report.lapsusData ? JSON.parse(report.lapsusData) : null
  }));

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

        <ReportListing reports={transformedReports} />
      </div>
    </PageContainer>
  );
}
