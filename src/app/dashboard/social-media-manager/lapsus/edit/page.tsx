import PageContainer from '@/components/layout/page-container';
import LapsusForm from '@/features/social-media-manager/components/lapsus-form';
import { mockLapsus } from '@/features/social-media-manager/utils/mock-data';

export default function EditLapsusPage() {
  // TODO: Fetch data from API
  const lapsus = mockLapsus;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Edit Laporan Khusus
            </h2>
            <p className='text-muted-foreground'>
              Ubah data laporan khusus dan upload dokumen pendukung
            </p>
          </div>
        </div>

        <LapsusForm
          pageTitle='Edit Laporan Khusus'
          initialData={{
            tanggal: lapsus.tanggal,
            jumlahKomentar: lapsus.jumlahKomentar,
            jumlahPostingan: lapsus.jumlahPostingan,
            keterangan: lapsus.keterangan
          }}
        />
      </div>
    </PageContainer>
  );
}
