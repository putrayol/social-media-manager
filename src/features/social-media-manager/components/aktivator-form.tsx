'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { socialMediaAktivatorSchema } from '../schemas/form-schema';

type FormData = z.infer<typeof socialMediaAktivatorSchema>;

interface AktivatorFormProps {
  initialData?: FormData | null;
  pageTitle: string;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function AktivatorForm({
  initialData,
  pageTitle,
  onSubmit
}: AktivatorFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(socialMediaAktivatorSchema),
    defaultValues: {
      namaAkun: initialData?.namaAkun || '',
      platform: initialData?.platform || 'TIKTOK',
      link: initialData?.link || ''
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
        const res = await fetch('/api/social-media-manager/aktivator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal membuat data aktivator';
          if (typeof window !== 'undefined') {
            alert(msg);
          }
          throw new Error(msg);
        }
      } else {
        const id = params?.id;
        const res = await fetch(`/api/social-media-manager/aktivator/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal memperbarui data aktivator';
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
          </div>

          <FormInput
            control={form.control}
            name='link'
            label='Link Profil'
            placeholder='Masukkan URL profil (contoh: https://tiktok.com/@username)'
            type='url'
            description='Link ke profil akun di platform yang dipilih'
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
