'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cyberTroopsSchema } from '../schemas/form-schema';
import { toast } from 'sonner';
import type { RequestItem } from '../types';

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
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(cyberTroopsSchema),
    defaultValues: {
      namaAkun: initialData?.namaAkun || '',
      platform: initialData?.platform || 'TIKTOK',
      kategori: initialData?.kategori || 'Positif',
      jenisIsu: initialData?.jenisIsu || '',
      jumlahKomentar: initialData?.jumlahKomentar || 0,
      link: initialData?.link || '',
      keterangan: initialData?.keterangan || '',
      requestId:
        initialData?.requestId !== undefined && initialData?.requestId !== null
          ? String(initialData.requestId)
          : undefined
    }
  });

  const router = useRouter();
  const params = useParams() as { id?: string };
  const isLoading = form.formState.isSubmitting;

  const selectedPlatform = form.watch('platform') || 'TIKTOK';

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        const res = await fetch('/api/social-media-manager/request?limit=1000');
        if (!res.ok) {
          throw new Error('Failed to fetch Request data');
        }
        const json = await res.json();
        setRequests(json?.data ?? []);
      } catch (error) {
        console.error('Error fetching Request list:', error);
        toast.error('Gagal memuat data Request');
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  async function handleSubmit(values: FormData) {
    try {
      const processedValues: FormData = {
        ...values,
        requestId:
          values.requestId != null && values.requestId !== ''
            ? Number(values.requestId)
            : undefined
      };

      if (onSubmit) {
        await onSubmit(processedValues);
      } else if (!initialData) {
        const res = await fetch('/api/social-media-manager/cyber-troops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedValues)
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
            body: JSON.stringify(processedValues)
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
              name='requestId'
              label='Request'
              placeholder={
                loadingRequests
                  ? 'Memuat data Request...'
                  : 'Pilih Request (opsional)'
              }
              options={requests.map((req) => {
                let post = 0;
                let komen = 0;
                let like = 0;

                switch (selectedPlatform) {
                  case 'TIKTOK': {
                    post = req.tiktokPost;
                    komen = req.tiktokKomen;
                    like = req.tiktokLike;
                    break;
                  }
                  case 'INSTAGRAM': {
                    post = req.instagramPost;
                    komen = req.instagramKomen;
                    like = req.instagramLike;
                    break;
                  }
                  case 'FACEBOOK': {
                    post = req.facebookPost;
                    komen = req.facebookKomen;
                    like = req.facebookLike;
                    break;
                  }
                  case 'TWITTER': {
                    post = req.twitterPost;
                    komen = req.twitterKomen;
                    like = req.twitterLike;
                    break;
                  }
                  case 'YOUTUBE': {
                    post = req.youtubePost;
                    komen = req.youtubeKomen;
                    like = req.youtubeLike;
                    break;
                  }
                  case 'OTHER': {
                    post = req.otherPost;
                    komen = req.otherKomen;
                    like = req.otherLike;
                    break;
                  }
                  default:
                    break;
                }

                const total = (post || 0) + (komen || 0) + (like || 0);

                return {
                  label: `#${req.no} - ${req.namaPaket} (${selectedPlatform.toLowerCase()} - Post: ${post}, Komen: ${komen}, Like: ${like}, Total: ${total})`,
                  value: String(req.id)
                };
              })}
              disabled={loadingRequests || requests.length === 0}
              description={
                !loadingRequests && requests.length === 0
                  ? 'Belum ada data Request. Silakan tambah Request terlebih dahulu.'
                  : undefined
              }
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
