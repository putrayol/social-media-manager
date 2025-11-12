import PageContainer from '@/components/layout/page-container';
import CyberTroopsForm from '@/features/social-media-manager/components/cyber-troops-form';

export default function CreateCyberTroopsPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Tambah Cyber Troops
            </h2>
            <p className='text-muted-foreground'>
              Tambahkan data cyber troops baru
            </p>
          </div>
        </div>

        <CyberTroopsForm pageTitle='Tambah Cyber Troops' initialData={null} />
      </div>
    </PageContainer>
  );
}
