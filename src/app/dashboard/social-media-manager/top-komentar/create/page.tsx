import PageContainer from '@/components/layout/page-container';
import TopKomentarForm from '@/features/social-media-manager/components/top-komentar-form';

export default function CreateTopKomentarPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Tambah Top Komentar Postingan
            </h2>
            <p className='text-muted-foreground'>
              Tambahkan data top komentar postingan baru
            </p>
          </div>
        </div>

        <TopKomentarForm
          pageTitle='Tambah Top Komentar Postingan'
          initialData={null}
        />
      </div>
    </PageContainer>
  );
}
