'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { requestSchema } from '../schemas/form-schema';

type FormData = z.infer<typeof requestSchema>;

interface RequestFormProps {
  initialData?: FormData | null;
  pageTitle: string;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function RequestForm({
  initialData,
  pageTitle,
  onSubmit
}: RequestFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      tanggal: initialData?.tanggal || '',
      namaPaket: initialData?.namaPaket || '',
      tiktokPost: initialData?.tiktokPost ?? 0,
      tiktokKomen: initialData?.tiktokKomen ?? 0,
      tiktokLike: initialData?.tiktokLike ?? 0,
      instagramPost: initialData?.instagramPost ?? 0,
      instagramKomen: initialData?.instagramKomen ?? 0,
      instagramLike: initialData?.instagramLike ?? 0,
      facebookPost: initialData?.facebookPost ?? 0,
      facebookKomen: initialData?.facebookKomen ?? 0,
      facebookLike: initialData?.facebookLike ?? 0,
      twitterPost: initialData?.twitterPost ?? 0,
      twitterKomen: initialData?.twitterKomen ?? 0,
      twitterLike: initialData?.twitterLike ?? 0,
      youtubePost: initialData?.youtubePost ?? 0,
      youtubeKomen: initialData?.youtubeKomen ?? 0,
      youtubeLike: initialData?.youtubeLike ?? 0,
      otherPost: initialData?.otherPost ?? 0,
      otherKomen: initialData?.otherKomen ?? 0,
      otherLike: initialData?.otherLike ?? 0,
      bonus: initialData?.bonus || ''
    }
  });

  const tiktokPost = form.watch('tiktokPost') || 0;
  const tiktokKomen = form.watch('tiktokKomen') || 0;
  const tiktokLike = form.watch('tiktokLike') || 0;
  const instagramPost = form.watch('instagramPost') || 0;
  const instagramKomen = form.watch('instagramKomen') || 0;
  const instagramLike = form.watch('instagramLike') || 0;
  const facebookPost = form.watch('facebookPost') || 0;
  const facebookKomen = form.watch('facebookKomen') || 0;
  const facebookLike = form.watch('facebookLike') || 0;
  const twitterPost = form.watch('twitterPost') || 0;
  const twitterKomen = form.watch('twitterKomen') || 0;
  const twitterLike = form.watch('twitterLike') || 0;
  const youtubePost = form.watch('youtubePost') || 0;
  const youtubeKomen = form.watch('youtubeKomen') || 0;
  const youtubeLike = form.watch('youtubeLike') || 0;
  const otherPost = form.watch('otherPost') || 0;
  const otherKomen = form.watch('otherKomen') || 0;
  const otherLike = form.watch('otherLike') || 0;

  const tiktokTotal = tiktokPost + tiktokKomen + tiktokLike;
  const instagramTotal = instagramPost + instagramKomen + instagramLike;
  const facebookTotal = facebookPost + facebookKomen + facebookLike;
  const twitterTotal = twitterPost + twitterKomen + twitterLike;
  const youtubeTotal = youtubePost + youtubeKomen + youtubeLike;
  const otherTotal = otherPost + otherKomen + otherLike;

  const router = useRouter();
  const params = useParams() as { id?: string };
  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: FormData) {
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else if (!initialData) {
        const res = await fetch('/api/social-media-manager/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal membuat data request';
          if (typeof window !== 'undefined') alert(msg);
          throw new Error(msg);
        }
      } else {
        const id = params?.id;
        const res = await fetch(`/api/social-media-manager/request/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          const msg = err?.error || 'Gagal memperbarui data request';
          if (typeof window !== 'undefined') alert(msg);
          throw new Error(msg);
        }
      }
      router.push('/dashboard/social-media-manager');
    } catch (error) {
      console.error('Error submitting request form:', error);
    }
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-4'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='namaPaket'
              label='Nama Paket'
              placeholder='Contoh: Paket Spesial 1000'
              required
            />
            <FormInput
              control={form.control}
              name='tanggal'
              label='Tanggal'
              placeholder='Tanggal request'
              type='date'
              required
            />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-1'>
            <FormTextarea
              control={form.control}
              name='bonus'
              label='Bonus / Catatan'
              placeholder='Bonus atau catatan tambahan (opsional)'
              config={{ rows: 3 }}
            />
          </div>

          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2 rounded-sm border p-3'>
              <h3 className='text-lg font-semibold'>TikTok</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-1'>
                <FormInput
                  control={form.control}
                  name='tiktokPost'
                  label='Post'
                  placeholder='Jumlah post'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='tiktokKomen'
                  label='Komen'
                  placeholder='Jumlah komentar'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='tiktokLike'
                  label='Like'
                  placeholder='Jumlah like'
                  type='number'
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>Total</span>
                  <div className='bg-muted mt-2 rounded-md border px-3 py-2 text-sm'>
                    {tiktokTotal}
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-2 rounded-sm border p-3'>
              <h3 className='text-lg font-semibold'>Instagram</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-1'>
                <FormInput
                  control={form.control}
                  name='instagramPost'
                  label='Post'
                  placeholder='Jumlah post'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='instagramKomen'
                  label='Komen'
                  placeholder='Jumlah komentar'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='instagramLike'
                  label='Like'
                  placeholder='Jumlah like'
                  type='number'
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>Total</span>
                  <div className='bg-muted mt-2 rounded-md border px-3 py-2 text-sm'>
                    {instagramTotal}
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-2 rounded-sm border p-3'>
              <h3 className='text-lg font-semibold'>Facebook</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-1'>
                <FormInput
                  control={form.control}
                  name='facebookPost'
                  label='Post'
                  placeholder='Jumlah post'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='facebookKomen'
                  label='Komen'
                  placeholder='Jumlah komentar'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='facebookLike'
                  label='Like'
                  placeholder='Jumlah like'
                  type='number'
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>Total</span>
                  <div className='bg-muted mt-2 rounded-md border px-3 py-2 text-sm'>
                    {facebookTotal}
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-2 rounded-sm border p-3'>
              <h3 className='text-lg font-semibold'>Twitter / X</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-1'>
                <FormInput
                  control={form.control}
                  name='twitterPost'
                  label='Post'
                  placeholder='Jumlah post'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='twitterKomen'
                  label='Komen'
                  placeholder='Jumlah komentar'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='twitterLike'
                  label='Like'
                  placeholder='Jumlah like'
                  type='number'
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>Total</span>
                  <div className='bg-muted mt-2 rounded-md border px-3 py-2 text-sm'>
                    {twitterTotal}
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-2 rounded-sm border p-3'>
              <h3 className='text-lg font-semibold'>YouTube</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-1'>
                <FormInput
                  control={form.control}
                  name='youtubePost'
                  label='Post'
                  placeholder='Jumlah post'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='youtubeKomen'
                  label='Komen'
                  placeholder='Jumlah komentar'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='youtubeLike'
                  label='Like'
                  placeholder='Jumlah like'
                  type='number'
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>Total</span>
                  <div className='bg-muted mt-2 rounded-md border px-3 py-2 text-sm'>
                    {youtubeTotal}
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-2 rounded-sm border p-3'>
              <h3 className='text-lg font-semibold'>Lainnya</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-1'>
                <FormInput
                  control={form.control}
                  name='otherPost'
                  label='Post'
                  placeholder='Jumlah post'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='otherKomen'
                  label='Komen'
                  placeholder='Jumlah komentar'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='otherLike'
                  label='Like'
                  placeholder='Jumlah like'
                  type='number'
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>Total</span>
                  <div className='bg-muted mt-2 rounded-md border px-3 py-2 text-sm'>
                    {otherTotal}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
