'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cyberTroopsSchema } from '../schemas/form-schema';

type FormData = z.infer<typeof cyberTroopsSchema>;

interface CyberTroopsFormProps {
  initialData?: FormData | null;
  pageTitle: string;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function CyberTroopsForm({
  initialData,
  pageTitle,
  onSubmit
}: CyberTroopsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(cyberTroopsSchema),
    defaultValues: {
      namaAkun: initialData?.namaAkun || '',
      platform: initialData?.platform || 'TIKTOK',
      kategori: initialData?.kategori || 'Positif',
      jenisIsu: initialData?.jenisIsu || '',
      jumlahKomentar: initialData?.jumlahKomentar || 0,
      link: initialData?.link || '',
      keterangan: initialData?.keterangan || ''
    }
  });

  const router = useRouter();
  const params = useParams() as { id?: string };
  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: FormData) {
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else if (!initialData) {
        const res = await fetch('/api/social-media-manager/cyber-troops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal membuat data cyber troops';
          if (typeof window !== 'undefined') {
            alert(msg);
          }
          throw new Error(msg);
        }
      } else {
        const id = params?.id;
        const res = await fetch(
          `/api/social-media-manager/cyber-troops/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal memperbarui data cyber troops';
          if (typeof window !== 'undefined') {
            alert(msg);
          }
          throw new Error(msg);
        }
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
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='namaAkun'
              label='Nama Akun'
              placeholder='Masukkan nama akun'
              required
            />

            <FormSelect
              control={form.control}
              name='platform'
              label='Platform'
              placeholder='Pilih platform'
              required
              options={[
                { label: 'TikTok', value: 'TIKTOK' },
                { label: 'Instagram', value: 'INSTAGRAM' },
                { label: 'Facebook', value: 'FACEBOOK' },
                { label: 'Twitter', value: 'TWITTER' },
                { label: 'YouTube', value: 'YOUTUBE' },
                { label: 'Lainnya', value: 'OTHER' }
              ]}
            />

            <FormSelect
              control={form.control}
              name='kategori'
              label='Kategori'
              placeholder='Pilih kategori'
              required
              options={[
                { label: 'Positif', value: 'Positif' },
                { label: 'Negatif', value: 'Negatif' }
              ]}
            />

            <FormInput
              control={form.control}
              name='jenisIsu'
              label='Jenis Isu'
              placeholder='Masukkan jenis isu'
              required
            />

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
              name='link'
              label='Link'
              placeholder='Masukkan URL link'
              type='url'
              required
            />
          </div>

          <FormTextarea
            control={form.control}
            name='keterangan'
            label='Keterangan'
            placeholder='Masukkan keterangan (opsional)'
            config={{ rows: 3 }}
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
