'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormDatePicker } from '@/components/forms/form-date-picker';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { socialMediaReportSchema } from '../schemas/form-schema';
import { SocialMediaReport } from '../types';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AktivatorForm from './aktivator-form';
import CyberTroopsForm from './cyber-troops-form';
import TopKomentarForm from './top-komentar-form';
import { Modal } from '@/components/ui/modal';
import { apiFetch } from '@/lib/api';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';

type FormData = z.infer<typeof socialMediaReportSchema>;

interface ReportFormProps {
  initialData?: SocialMediaReport | null;
  pageTitle: string;
}

export default function ReportForm({
  initialData,
  pageTitle
}: ReportFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(socialMediaReportSchema),
    defaultValues: {
      reportNo: initialData?.reportNo || '',
      tanggal: initialData?.tanggal || new Date(),
      aktivator: initialData?.aktivator || [],
      cyberTroops: initialData?.cyberTroops || [],
      topKomentar: initialData?.topKomentar || [],
      lapsus: initialData?.lapsus
    }
  });

  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const [activeTab, setActiveTab] = useState<
    'info' | 'aktivator' | 'cyber' | 'top' | 'lapsus'
  >('info');

  // Local state for lists (fetched from DB)
  const [aktivatorItems, setAktivatorItems] = useState<any[]>([]);
  const [cyberItems, setCyberItems] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState({
    aktivator: false,
    cyber: false,
    top: false
  });

  // Modals visibility
  const [showAktivatorModal, setShowAktivatorModal] = useState(false);
  const [showCyberModal, setShowCyberModal] = useState(false);
  const [showTopModal, setShowTopModal] = useState(false);

  // Search dialogs state
  const [showSearchAktivator, setShowSearchAktivator] = useState(false);
  const [showSearchCyber, setShowSearchCyber] = useState(false);
  const [showSearchTop, setShowSearchTop] = useState(false);

  // Search queries and results
  const [aktivatorQuery, setAktivatorQuery] = useState('');
  const [aktivatorSearchResults, setAktivatorSearchResults] = useState<any[]>(
    []
  );
  const [cyberQuery, setCyberQuery] = useState('');
  const [cyberSearchResults, setCyberSearchResults] = useState<any[]>([]);
  const [topQuery, setTopQuery] = useState('');
  const [topSearchResults, setTopSearchResults] = useState<any[]>([]);

  // Fetch functions
  async function fetchAktivator() {
    setLoadingLists((s) => ({ ...s, aktivator: true }));
    try {
      const res = await apiFetch(
        '/api/social-media-manager/aktivator?page=1&limit=50'
      );
      const json = await res.json();
      if (json?.success) setAktivatorItems(json.data || []);
    } catch (e) {
      console.error('Failed to load aktivator', e);
    } finally {
      setLoadingLists((s) => ({ ...s, aktivator: false }));
    }
  }

  async function fetchCyber() {
    setLoadingLists((s) => ({ ...s, cyber: true }));
    try {
      const res = await apiFetch(
        '/api/social-media-manager/cyber-troops?page=1&limit=50'
      );
      const json = await res.json();
      if (json?.success) setCyberItems(json.data || []);
    } catch (e) {
      console.error('Failed to load cyber troops', e);
    } finally {
      setLoadingLists((s) => ({ ...s, cyber: false }));
    }
  }

  async function fetchTop() {
    setLoadingLists((s) => ({ ...s, top: true }));
    try {
      const res = await apiFetch(
        '/api/social-media-manager/top-komentar?page=1&limit=50'
      );
      const json = await res.json();
      if (json?.success) setTopItems(json.data || []);
    } catch (e) {
      console.error('Failed to load top komentar', e);
    } finally {
      setLoadingLists((s) => ({ ...s, top: false }));
    }
  }

  useEffect(() => {
    fetchAktivator();
    fetchCyber();
    fetchTop();
  }, []);

  // Debounced search effects
  useEffect(() => {
    if (!showSearchAktivator) return;
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/social-media-manager/aktivator?page=1&limit=10&search=${encodeURIComponent(aktivatorQuery)}`
        );
        const json = await res.json();
        setAktivatorSearchResults(json?.data || []);
      } catch (e) {
        console.error('Search aktivator failed', e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [aktivatorQuery, showSearchAktivator]);

  useEffect(() => {
    if (!showSearchCyber) return;
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/social-media-manager/cyber-troops?page=1&limit=10&search=${encodeURIComponent(cyberQuery)}`
        );
        const json = await res.json();
        setCyberSearchResults(json?.data || []);
      } catch (e) {
        console.error('Search cyber troops failed', e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [cyberQuery, showSearchCyber]);

  useEffect(() => {
    if (!showSearchTop) return;
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/social-media-manager/top-komentar?page=1&limit=10&search=${encodeURIComponent(topQuery)}`
        );
        const json = await res.json();
        setTopSearchResults(json?.data || []);
      } catch (e) {
        console.error('Search top komentar failed', e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [topQuery, showSearchTop]);

  // Helpers: add/remove selected entries into form values
  function addAktivatorFromItem(item: any) {
    const current = form.getValues('aktivator') || [];
    const exists = current.some(
      (x) =>
        x.namaAkun === item.namaAkun &&
        x.platform === item.platform &&
        x.jenisKonten === item.jenisKonten
    );
    if (exists) return;
    const mapped = {
      namaAkun: item.namaAkun,
      platform: item.platform,
      jenisKonten: item.jenisKonten,
      link: item.link || undefined
    };
    form.setValue('aktivator', [...current, mapped], { shouldValidate: true });
  }

  function removeAktivatorAt(index: number) {
    const current = form.getValues('aktivator') || [];
    form.setValue(
      'aktivator',
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  function addCyberFromItem(item: any) {
    const current = form.getValues('cyberTroops') || [];
    const exists = current.some(
      (x) =>
        x.namaAkun === item.namaAkun &&
        x.platform === item.platform &&
        x.jenisIsu === item.jenisIsu
    );
    if (exists) return;
    const mapped = {
      namaAkun: item.namaAkun,
      platform: item.platform,
      kategori: item.kategori,
      jenisIsu: item.jenisIsu,
      jumlahKomentar: Number(item.jumlahKomentar ?? 0),
      link: item.link || undefined,
      keterangan: item.keterangan || undefined
    };
    form.setValue('cyberTroops', [...current, mapped], {
      shouldValidate: true
    });
  }

  function removeCyberAt(index: number) {
    const current = form.getValues('cyberTroops') || [];
    form.setValue(
      'cyberTroops',
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  function addTopFromItem(item: any) {
    const current = form.getValues('topKomentar') || [];
    const exists = current.some(
      (x) =>
        x.namaAkun === item.namaAkun &&
        x.platform === item.platform &&
        Number(x.jumlahTopKomentar) === Number(item.jumlahTopKomentar)
    );
    if (exists) return;
    const mapped = {
      namaAkun: item.namaAkun,
      platform: item.platform,
      jumlahTopKomentar: Number(item.jumlahTopKomentar ?? 0),
      link: item.link || undefined,
      keterangan: item.keterangan || undefined
    };
    form.setValue('topKomentar', [...current, mapped], {
      shouldValidate: true
    });
  }

  function removeTopAt(index: number) {
    const current = form.getValues('topKomentar') || [];
    form.setValue(
      'topKomentar',
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  async function handleSubmit(values: FormData) {
    try {
      // TODO: Submit to API
      console.log('Form values:', values);
      router.push('/dashboard/social-media-manager/reports');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  // Delete handlers
  async function deleteAktivator(id: string) {
    try {
      const res = await apiFetch(`/api/social-media-manager/aktivator/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) await fetchAktivator();
    } catch (e) {
      console.error('Failed to delete aktivator', e);
    }
  }
  async function deleteCyber(id: string) {
    try {
      const res = await apiFetch(
        `/api/social-media-manager/cyber-troops/${id}`,
        { method: 'DELETE' }
      );
      if (res.ok) await fetchCyber();
    } catch (e) {
      console.error('Failed to delete cyber troops', e);
    }
  }
  async function deleteTop(id: string) {
    try {
      const res = await apiFetch(
        `/api/social-media-manager/top-komentar/${id}`,
        { method: 'DELETE' }
      );
      if (res.ok) await fetchTop();
    } catch (e) {
      console.error('Failed to delete top komentar', e);
    }
  }

  return (
    <div className='space-y-6'>
      <Form
        form={form}
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-6'
      >
        {/* Report Info Tab */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Laporan</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormInput
              control={form.control}
              name='reportNo'
              label='Nomor Laporan'
              placeholder='#088'
            />
            <FormDatePicker
              control={form.control}
              name='tanggal'
              label='Tanggal Laporan'
              required
            />
          </CardContent>
        </Card>

        {/* Aktivator Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              A. Social Media Aktivator (Report Giat Konten)
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Selected for report */}
            <div className='space-y-2'>
              <div className='text-sm font-medium'>
                Dipilih untuk laporan: {form.watch('aktivator')?.length || 0}
              </div>
              {(form.watch('aktivator') || []).map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between rounded border px-3 py-2'
                >
                  <div className='text-sm'>
                    <span className='font-semibold'>{item.namaAkun}</span> •{' '}
                    {item.platform}
                    <div className='text-muted-foreground'>
                      Konten: {item.jenisKonten}
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => removeAktivatorAt(idx)}
                  >
                    <Trash2 className='h-4 w-4 text-red-600' />
                  </Button>
                </div>
              ))}
            </div>
            <div className='text-muted-foreground mb-2 text-sm'>
              Data dari database. Total: {aktivatorItems.length}
            </div>
            <div className='space-y-2'>
              {loadingLists.aktivator ? (
                <p className='text-muted-foreground text-sm'>Memuat data...</p>
              ) : aktivatorItems.length === 0 ? (
                <p className='text-muted-foreground text-sm'>Belum ada data.</p>
              ) : (
                aktivatorItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between rounded border px-3 py-2'
                  >
                    <div className='text-sm'>
                      <span className='font-semibold'>{item.namaAkun}</span> •{' '}
                      {item.platform}
                      <div className='text-muted-foreground'>
                        Konten: {item.jenisKonten}
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => addAktivatorFromItem(item)}
                      >
                        Pilih
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => deleteAktivator(item.id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => setShowAktivatorModal(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Tambah Aktivator
              </Button>
              <Button
                type='button'
                variant='default'
                className='w-full'
                onClick={() => {
                  setShowSearchAktivator(true);
                  setAktivatorQuery('');
                }}
              >
                Cari & Pilih dari Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cyber Troops Section */}
        <Card>
          <CardHeader>
            <CardTitle>B. Cyber Troops (Report Giat Buzzer)</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Selected for report */}
            <div className='space-y-2'>
              <div className='text-sm font-medium'>
                Dipilih untuk laporan: {form.watch('cyberTroops')?.length || 0}
              </div>
              {(form.watch('cyberTroops') || []).map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between rounded border px-3 py-2'
                >
                  <div className='text-sm'>
                    <span className='font-semibold'>{item.namaAkun}</span> •{' '}
                    {item.platform}
                    <div className='text-muted-foreground'>
                      Kategori: {item.kategori} • Isu: {item.jenisIsu}
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => removeCyberAt(idx)}
                  >
                    <Trash2 className='h-4 w-4 text-red-600' />
                  </Button>
                </div>
              ))}
            </div>
            <div className='text-muted-foreground mb-2 text-sm'>
              Data dari database. Total: {cyberItems.length}
            </div>
            <div className='space-y-2'>
              {loadingLists.cyber ? (
                <p className='text-muted-foreground text-sm'>Memuat data...</p>
              ) : cyberItems.length === 0 ? (
                <p className='text-muted-foreground text-sm'>Belum ada data.</p>
              ) : (
                cyberItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between rounded border px-3 py-2'
                  >
                    <div className='text-sm'>
                      <span className='font-semibold'>{item.namaAkun}</span> •{' '}
                      {item.platform}
                      <div className='text-muted-foreground'>
                        Kategori: {item.kategori} • Isu: {item.jenisIsu}
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => addCyberFromItem(item)}
                      >
                        Pilih
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => deleteCyber(item.id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => setShowCyberModal(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Tambah Cyber Troops
              </Button>
              <Button
                type='button'
                variant='default'
                className='w-full'
                onClick={() => {
                  setShowSearchCyber(true);
                  setCyberQuery('');
                }}
              >
                Cari & Pilih dari Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Komentar Section */}
        <Card>
          <CardHeader>
            <CardTitle>C. Report Giat Top Komentar Postingan</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Selected for report */}
            <div className='space-y-2'>
              <div className='text-sm font-medium'>
                Dipilih untuk laporan: {form.watch('topKomentar')?.length || 0}
              </div>
              {(form.watch('topKomentar') || []).map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between rounded border px-3 py-2'
                >
                  <div className='text-sm'>
                    <span className='font-semibold'>{item.namaAkun}</span> •{' '}
                    {item.platform}
                    <div className='text-muted-foreground'>
                      Top Komentar: {item.jumlahTopKomentar}
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => removeTopAt(idx)}
                  >
                    <Trash2 className='h-4 w-4 text-red-600' />
                  </Button>
                </div>
              ))}
            </div>
            <div className='text-muted-foreground mb-2 text-sm'>
              Data dari database. Total: {topItems.length}
            </div>
            <div className='space-y-2'>
              {loadingLists.top ? (
                <p className='text-muted-foreground text-sm'>Memuat data...</p>
              ) : topItems.length === 0 ? (
                <p className='text-muted-foreground text-sm'>Belum ada data.</p>
              ) : (
                topItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between rounded border px-3 py-2'
                  >
                    <div className='text-sm'>
                      <span className='font-semibold'>{item.namaAkun}</span> •{' '}
                      {item.platform}
                      <div className='text-muted-foreground'>
                        Top Komentar: {item.jumlahTopKomentar}
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => addTopFromItem(item)}
                      >
                        Pilih
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => deleteTop(item.id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => setShowTopModal(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Tambah Top Komentar
              </Button>
              <Button
                type='button'
                variant='default'
                className='w-full'
                onClick={() => {
                  setShowSearchTop(true);
                  setTopQuery('');
                }}
              >
                Cari & Pilih dari Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lapsus Section */}
        <Card>
          <CardHeader>
            <CardTitle>D. Laporan Khusus (LAPSUS)</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormDatePicker
              control={form.control}
              name='lapsus.tanggal'
              label='Tanggal Laporan'
              required
            />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                control={form.control}
                name='lapsus.jumlahKomentar'
                label='Jumlah Komentar'
                type='number'
                required
              />
              <FormInput
                control={form.control}
                name='lapsus.jumlahPostingan'
                label='Jumlah Postingan'
                type='number'
                required
              />
            </div>
            <FormTextarea
              control={form.control}
              name='lapsus.keterangan'
              label='Keterangan'
              placeholder='Masukkan keterangan laporan'
              config={{ rows: 4 }}
            />

            <FormFileUpload
              control={form.control}
              name='lapsus.documentFiles'
              label='Upload Dokumen'
              description='Upload file pendukung (PDF, Word, Excel, atau gambar). Maksimal 10 file, 10MB per file'
              config={{ maxSize: 10 * 1024 * 1024, maxFiles: 10 }}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex gap-4'>
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Menyimpan...' : 'Simpan Laporan'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            className='w-full'
          >
            Batal
          </Button>
        </div>
      </Form>

      {/* Aktivator Modal */}
      <Modal
        isOpen={showAktivatorModal}
        onClose={() => setShowAktivatorModal(false)}
        title='Tambah Aktivator'
        description='Tambah data aktivator'
      >
        <AktivatorForm
          pageTitle='Tambah Aktivator'
          onSubmit={async (values) => {
            const res = await fetch('/api/social-media-manager/aktivator', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });
            if (res.ok) {
              setShowAktivatorModal(false);
              await fetchAktivator();
            }
          }}
        />
      </Modal>

      {/* Cyber Troops Modal */}
      <Modal
        isOpen={showCyberModal}
        onClose={() => setShowCyberModal(false)}
        title='Tambah Cyber Troops'
        description='Tambah data cyber troops'
      >
        <CyberTroopsForm
          pageTitle='Tambah Cyber Troops'
          onSubmit={async (values) => {
            const res = await fetch('/api/social-media-manager/cyber-troops', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });
            if (res.ok) {
              setShowCyberModal(false);
              await fetchCyber();
            }
          }}
        />
      </Modal>

      {/* Top Komentar Modal */}
      <Modal
        isOpen={showTopModal}
        onClose={() => setShowTopModal(false)}
        title='Tambah Top Komentar'
        description='Tambah data top komentar'
      >
        <TopKomentarForm
          pageTitle='Tambah Top Komentar'
          onSubmit={async (values) => {
            const res = await fetch('/api/social-media-manager/top-komentar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });
            if (res.ok) {
              setShowTopModal(false);
              await fetchTop();
            }
          }}
        />
      </Modal>

      {/* Search Dialog: Aktivator */}
      <CommandDialog
        open={showSearchAktivator}
        onOpenChange={setShowSearchAktivator}
      >
        <CommandInput
          placeholder='Cari aktivator...'
          value={aktivatorQuery}
          onValueChange={setAktivatorQuery}
        />
        <CommandList>
          <CommandEmpty>Tidak ada hasil</CommandEmpty>
          <CommandGroup heading='Aktivator'>
            {aktivatorSearchResults.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  addAktivatorFromItem(item);
                  setShowSearchAktivator(false);
                }}
              >
                {item.namaAkun} • {item.platform} — Konten: {item.jenisKonten}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Search Dialog: Cyber Troops */}
      <CommandDialog open={showSearchCyber} onOpenChange={setShowSearchCyber}>
        <CommandInput
          placeholder='Cari cyber troops...'
          value={cyberQuery}
          onValueChange={setCyberQuery}
        />
        <CommandList>
          <CommandEmpty>Tidak ada hasil</CommandEmpty>
          <CommandGroup heading='Cyber Troops'>
            {cyberSearchResults.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  addCyberFromItem(item);
                  setShowSearchCyber(false);
                }}
              >
                {item.namaAkun} • {item.platform} — {item.kategori} •{' '}
                {item.jenisIsu}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Search Dialog: Top Komentar */}
      <CommandDialog open={showSearchTop} onOpenChange={setShowSearchTop}>
        <CommandInput
          placeholder='Cari top komentar...'
          value={topQuery}
          onValueChange={setTopQuery}
        />
        <CommandList>
          <CommandEmpty>Tidak ada hasil</CommandEmpty>
          <CommandGroup heading='Top Komentar'>
            {topSearchResults.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  addTopFromItem(item);
                  setShowSearchTop(false);
                }}
              >
                {item.namaAkun} • {item.platform} — Top:{' '}
                {item.jumlahTopKomentar}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
