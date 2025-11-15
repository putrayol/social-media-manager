import PageContainer from '@/components/layout/page-container';
import RequestForm from '@/features/social-media-manager/components/request-form';

export default function CreateRequestPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Tambah Request
            </h2>
            <p className='text-muted-foreground'>Tambah data request baru</p>
          </div>
        </div>

        <RequestForm pageTitle='Tambah Request' initialData={null} />
      </div>
    </PageContainer>
  );
}
