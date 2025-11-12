import PageContainer from '@/components/layout/page-container';
import ReportForm from '@/features/social-media-manager/components/report-form';
import { mockReports } from '@/features/social-media-manager/utils/mock-reports';

interface EditReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReportPage({ params }: EditReportPageProps) {
  // TODO: Fetch data from API
  const { id } = await params;
  const report = mockReports.find((item) => item.id === id);

  if (!report) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Laporan tidak ditemukan</h2>
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
