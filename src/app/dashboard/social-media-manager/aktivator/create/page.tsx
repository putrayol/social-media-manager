import PageContainer from '@/components/layout/page-container';
import AktivatorForm from '@/features/social-media-manager/components/aktivator-form';

export default function CreateAktivatorPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Tambah Social Media Aktivator
            </h2>
            <p className='text-muted-foreground'>
              Tambahkan data aktivator media sosial baru
            </p>
          </div>
        </div>

        <AktivatorForm
          pageTitle='Tambah Social Media Aktivator'
          initialData={null}
        />
      </div>
    </PageContainer>
  );
}
