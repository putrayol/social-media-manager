'use client';

import { FormDatePicker } from '@/components/forms/form-date-picker';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { laporanKhususSchema } from '../schemas/form-schema';

type FormData = z.infer<typeof laporanKhususSchema>;

interface LapsusFormProps {
  initialData?: FormData | null;
  pageTitle: string;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function LapsusForm({
  initialData,
  pageTitle,
  onSubmit
}: LapsusFormProps) {
  const form = useForm({
    resolver: zodResolver(laporanKhususSchema),
    defaultValues: {
      tanggal: initialData?.tanggal || new Date(),
      jumlahKomentar: initialData?.jumlahKomentar || 0,
      jumlahPostingan: initialData?.jumlahPostingan || 0,
      keterangan: initialData?.keterangan || ''
    }
  });

  const router = useRouter();
  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: FormData) {
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      router.push('/dashboard/social-media-manager');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-8'
        >
          <FormDatePicker
            control={form.control}
            name='tanggal'
            label='Tanggal Laporan'
            required
          />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='jumlahKomentar'
              label='Jumlah Komentar'
              placeholder='Masukkan jumlah komentar'
              type='number'
              required
            />

            <FormInput
              control={form.control}
              name='jumlahPostingan'
              label='Jumlah Postingan'
              placeholder='Masukkan jumlah postingan'
              type='number'
              required
            />
          </div>

          <FormTextarea
            control={form.control}
            name='keterangan'
            label='Keterangan'
            placeholder='Masukkan keterangan laporan'
            config={{ rows: 4 }}
          />

          <FormFileUpload
            control={form.control}
            name='documentFiles'
            label='Upload Dokumen'
            description='Upload file pendukung (PDF, Word, Excel, atau gambar). Maksimal 10 file, 10MB per file'
            config={{
              maxSize: 10 * 1024 * 1024,
              maxFiles: 10
            }}
          />

          <div className='flex gap-4'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
            >
              Batal
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
