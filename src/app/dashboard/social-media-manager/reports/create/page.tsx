import PageContainer from '@/components/layout/page-container';
import ReportForm from '@/features/social-media-manager/components/report-form';

export default function CreateReportPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Buat Laporan Baru
            </h2>
            <p className='text-muted-foreground'>
              Buat laporan media sosial lengkap dengan semua section
            </p>
          </div>
        </div>

        <ReportForm pageTitle='Buat Laporan Baru' initialData={null} />
      </div>
    </PageContainer>
  );
}
