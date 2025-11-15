'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { topKomentarPostinganSchema } from '../schemas/form-schema';
import { toast } from 'sonner';
import type { RequestItem } from '../types';

type FormData = z.infer<typeof topKomentarPostinganSchema>;

interface TopKomentarFormProps {
  initialData?: FormData | null;
  pageTitle: string;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function TopKomentarForm({
  initialData,
  pageTitle,
  onSubmit
}: TopKomentarFormProps) {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(topKomentarPostinganSchema),
    defaultValues: {
      namaAkun: initialData?.namaAkun || '',
      platform: initialData?.platform || 'TIKTOK',
      jumlahTopKomentar: initialData?.jumlahTopKomentar || 0,
      link: initialData?.link || '',
      keterangan: initialData?.keterangan || '',
      documentFiles: initialData?.documentFiles || [],
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
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const apiMessage = (json as any)?.error || (json as any)?.message;
          const message =
            res.status === 403 &&
            apiMessage?.toLowerCase().includes('organization')
              ? 'Silakan pilih organisasi terlebih dahulu sebelum mengakses data Request'
              : apiMessage || 'Gagal memuat data Request';

          toast.error(message);
          setRequests([]);
          return;
        }

        setRequests((json as any)?.data ?? []);
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
      let processedValues: FormData = {
        ...values,
        requestId:
          values.requestId != null && values.requestId !== ''
            ? Number(values.requestId)
            : undefined
      };

      // Handle file uploads if there are files
      if (values.documentFiles && values.documentFiles.length > 0) {
        const filesToUpload = values.documentFiles.filter(
          (file) => file instanceof File
        );

        // Get existing files (already uploaded)
        const existingFiles = values.documentFiles.filter(
          (file) => !(file instanceof File)
        );

        let uploadedFiles = [];

        // Upload new files if any
        if (filesToUpload.length > 0) {
          const formData = new FormData();
          filesToUpload.forEach((file) => {
            formData.append('files', file as File);
          });

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!uploadRes.ok) {
            const error = await uploadRes.json();
            console.error('Error uploading files:', error);
            toast.error(error.error || 'Gagal upload file');
            return;
          }

          const uploadData = await uploadRes.json();
          uploadedFiles = uploadData.data || [];
          toast.success(`${uploadedFiles.length} file berhasil di-upload`);
        }

        // Combine all files (existing + newly uploaded)
        processedValues.documentFiles = [...existingFiles, ...uploadedFiles];
      }

      if (onSubmit) {
        await onSubmit(processedValues);
      } else if (!initialData) {
        const res = await fetch('/api/social-media-manager/top-komentar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedValues)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal membuat data top komentar';
          toast.error(msg);
          throw new Error(msg);
        }
        toast.success('Data top komentar berhasil dibuat');
      } else {
        const id = params?.id;
        const res = await fetch(
          `/api/social-media-manager/top-komentar/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processedValues)
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal memperbarui data top komentar';
          toast.error(msg);
          throw new Error(msg);
        }
        toast.success('Data top komentar berhasil diperbarui');
      }
      router.push('/dashboard/social-media-manager');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
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

            <FormInput
              control={form.control}
              name='jumlahTopKomentar'
              label='Jumlah Top Komentar'
              placeholder='Masukkan jumlah top komentar'
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

          <FormFileUpload
            control={form.control}
            name='documentFiles'
            label='Upload Dokumen'
            description='Upload file pendukung (PDF, Word, Excel, atau gambar). Maksimal 10 file, 10MB per file'
            config={{
              maxSize: 10 * 1024 * 1024,
              maxFiles: 10,
              multiple: true,
              acceptedTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
                'image/gif'
              ]
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
