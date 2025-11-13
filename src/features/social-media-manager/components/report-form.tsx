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
import { toast } from 'sonner';
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
  // Helper function to safely convert to Date
  const toDate = (value: any): Date => {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    try {
      return new Date(value);
    } catch {
      return new Date();
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(socialMediaReportSchema),
    defaultValues: {
      reportNo: initialData?.reportNo || '',
      namaLaporan: initialData?.namaLaporan || '',
      tanggal: toDate(initialData?.tanggal),
      aktivator: initialData?.aktivator || [],
      cyberTroops: initialData?.cyberTroops || [],
      topKomentar: initialData?.topKomentar || [],
      lapsus: initialData?.lapsus
        ? {
            tanggal: toDate(initialData.lapsus.tanggal),
            jumlahKomentar: initialData.lapsus.jumlahKomentar || 0,
            jumlahPostingan: initialData.lapsus.jumlahPostingan || 0,
            keterangan: initialData.lapsus.keterangan || '',
            documentFiles: initialData.lapsus.documentFiles || []
          }
        : undefined
    }
  });

  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug form state
  useEffect(() => {
    const values = form.getValues();
    const errors = form.formState.errors;
    console.log('=== FORM DEBUG ===');
    console.log('Form values:', values);
    console.log('Form errors:', errors);

    // Log detailed errors
    if (Object.keys(errors).length > 0) {
      console.log('🔴 VALIDATION ERRORS FOUND:');
      Object.entries(errors).forEach(([key, error]) => {
        console.log(`  - ${key}:`, error);
        if (error && typeof error === 'object' && 'message' in error) {
          console.log(`    Message: ${error.message}`);
        }
        // Check nested errors (for arrays)
        if (Array.isArray(values[key as keyof typeof values])) {
          console.log(
            `    Array field with ${(values[key as keyof typeof values] as any[]).length} items`
          );
          if (error && typeof error === 'object') {
            Object.entries(error).forEach(([index, itemError]) => {
              if (index !== 'message' && index !== 'type') {
                console.log(`      Item [${index}]:`, itemError);
                // Log detailed error for each item
                if (itemError && typeof itemError === 'object') {
                  Object.entries(itemError).forEach(
                    ([fieldName, fieldError]: any) => {
                      if (
                        fieldError &&
                        typeof fieldError === 'object' &&
                        'message' in fieldError
                      ) {
                        console.log(
                          `        - ${fieldName}: ${fieldError.message}`
                        );
                      }
                    }
                  );
                }
              }
            });
          }
        }
      });
    } else {
      console.log('✅ No validation errors');
    }

    console.log('Form isValid:', form.formState.isValid);
    console.log('Form isDirty:', form.formState.isDirty);
    console.log('Tanggal type:', typeof values.tanggal, values.tanggal);
    if (values.lapsus?.tanggal) {
      console.log(
        'Lapsus tanggal type:',
        typeof values.lapsus.tanggal,
        values.lapsus.tanggal
      );
    }
    console.log('==================');
  }, [form.formState.errors, form.formState.isValid, form.formState.isDirty]);
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

  // State for used IDs
  const [usedIds, setUsedIds] = useState({
    aktivatorIds: [] as number[],
    cyberTroopsIds: [] as number[],
    topKomentarIds: [] as number[]
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

  // Fetch used IDs from other reports
  async function fetchUsedIds() {
    try {
      const excludeReportId = initialData?.id
        ? `?excludeReportId=${initialData.id}`
        : '';
      const res = await apiFetch(
        `/api/social-media-manager/reports/used-ids${excludeReportId}`
      );
      const json = await res.json();
      if (json?.success) {
        setUsedIds(
          json.data || {
            aktivatorIds: [],
            cyberTroopsIds: [],
            topKomentarIds: []
          }
        );
      }
    } catch (e) {
      console.error('Failed to load used IDs', e);
    }
  }

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
    fetchUsedIds();
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
        // Filter out items that are already used in other reports
        const filtered = (json?.data || []).filter(
          (item: any) => !usedIds.aktivatorIds.includes(item.id)
        );
        setAktivatorSearchResults(filtered);
      } catch (e) {
        console.error('Search aktivator failed', e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [aktivatorQuery, showSearchAktivator, usedIds.aktivatorIds]);

  useEffect(() => {
    if (!showSearchCyber) return;
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/social-media-manager/cyber-troops?page=1&limit=10&search=${encodeURIComponent(cyberQuery)}`
        );
        const json = await res.json();
        // Filter out items that are already used in other reports
        const filtered = (json?.data || []).filter(
          (item: any) => !usedIds.cyberTroopsIds.includes(item.id)
        );
        setCyberSearchResults(filtered);
      } catch (e) {
        console.error('Search cyber troops failed', e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [cyberQuery, showSearchCyber, usedIds.cyberTroopsIds]);

  useEffect(() => {
    if (!showSearchTop) return;
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/social-media-manager/top-komentar?page=1&limit=10&search=${encodeURIComponent(topQuery)}`
        );
        const json = await res.json();
        // Filter out items that are already used in other reports
        const filtered = (json?.data || []).filter(
          (item: any) => !usedIds.topKomentarIds.includes(item.id)
        );
        setTopSearchResults(filtered);
      } catch (e) {
        console.error('Search top komentar failed', e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [topQuery, showSearchTop, usedIds.topKomentarIds]);

  // Helpers: add/remove selected entries into form values
  function addAktivatorFromItem(item: any) {
    const current = form.getValues('aktivator') || [];
    const exists = current.some(
      (x) =>
        x.id === item.id ||
        (x.namaAkun === item.namaAkun &&
          x.platform === item.platform &&
          x.jenisKonten === item.jenisKonten)
    );
    if (exists) return;
    const mapped = {
      id: item.id, // ✅ Include ID to link existing data
      namaAkun: item.namaAkun,
      platform: item.platform,
      jenisKonten: item.jenisKonten,
      link: item.link || '' // ✅ Ensure link is always a string (empty string if not provided)
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
        x.id === item.id ||
        (x.namaAkun === item.namaAkun &&
          x.platform === item.platform &&
          x.jenisIsu === item.jenisIsu)
    );
    if (exists) return;
    const mapped = {
      id: item.id, // ✅ Include ID to link existing data
      namaAkun: item.namaAkun,
      platform: item.platform,
      kategori: item.kategori,
      jenisIsu: item.jenisIsu,
      jumlahKomentar: Number(item.jumlahKomentar ?? 0),
      link: item.link || '', // ✅ Ensure link is always a string (empty string if not provided)
      keterangan: item.keterangan || null // ✅ Ensure keterangan is null if not provided
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
        x.id === item.id ||
        (x.namaAkun === item.namaAkun &&
          x.platform === item.platform &&
          Number(x.jumlahTopKomentar) === Number(item.jumlahTopKomentar))
    );
    if (exists) return;
    const mapped = {
      id: item.id, // ✅ Include ID to link existing data
      namaAkun: item.namaAkun,
      platform: item.platform,
      jumlahTopKomentar: Number(item.jumlahTopKomentar ?? 0),
      link: item.link || '', // ✅ Ensure link is always a string (empty string if not provided)
      keterangan: item.keterangan || null, // ✅ Ensure keterangan is null if not provided
      documentFiles: item.documentFiles || [] // ✅ Add documentFiles array
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
    // Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate call');
      return;
    }

    console.log('handleSubmit called with values:', values);
    setIsSubmitting(true);

    try {
      let processedValues = { ...values };

      // ✅ IMPORTANT: Keep ID if item has it (existing item from DB)
      // Only include full data if item doesn't have ID (new item)
      if (processedValues.aktivator && processedValues.aktivator.length > 0) {
        processedValues.aktivator = processedValues.aktivator.map(
          (item: any, index: number) => {
            // If item has ID, it's from database - only send ID
            if (item.id) {
              return { id: item.id };
            }
            // Otherwise, it's a new item - send full data
            return {
              no: item.no || index + 1,
              namaAkun: item.namaAkun,
              platform: item.platform,
              jenisKonten: item.jenisKonten,
              link: item.link || null
            };
          }
        );
      }
      if (
        processedValues.cyberTroops &&
        processedValues.cyberTroops.length > 0
      ) {
        processedValues.cyberTroops = processedValues.cyberTroops.map(
          (item: any, index: number) => {
            // If item has ID, it's from database - only send ID
            if (item.id) {
              return { id: item.id };
            }
            // Otherwise, it's a new item - send full data
            return {
              no: item.no || index + 1,
              namaAkun: item.namaAkun,
              platform: item.platform,
              kategori: item.kategori,
              jenisIsu: item.jenisIsu,
              jumlahKomentar: item.jumlahKomentar || 0,
              link: item.link || null,
              keterangan: item.keterangan || null
            };
          }
        );
      }
      if (
        processedValues.topKomentar &&
        processedValues.topKomentar.length > 0
      ) {
        processedValues.topKomentar = processedValues.topKomentar.map(
          (item: any, index: number) => {
            // If item has ID, it's from database - only send ID
            if (item.id) {
              return { id: item.id };
            }
            // Otherwise, it's a new item - send full data
            return {
              no: item.no || index + 1,
              namaAkun: item.namaAkun,
              platform: item.platform,
              jumlahTopKomentar: item.jumlahTopKomentar || 0,
              link: item.link || null,
              keterangan: item.keterangan || null
            };
          }
        );
      }

      // Handle file uploads if there are files
      if (
        values.lapsus?.documentFiles &&
        values.lapsus.documentFiles.length > 0
      ) {
        const filesToUpload = values.lapsus.documentFiles.filter(
          (file) => file instanceof File
        );

        // Get existing files (already uploaded)
        const existingFiles = values.lapsus.documentFiles.filter(
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
        processedValues.lapsus = {
          ...values.lapsus,
          documentFiles: [...existingFiles, ...uploadedFiles]
        };
      }

      // Convert Date objects to ISO strings for JSON serialization
      const dataToSend = {
        ...processedValues,
        tanggal:
          processedValues.tanggal instanceof Date
            ? processedValues.tanggal.toISOString()
            : processedValues.tanggal,
        lapsus: processedValues.lapsus
          ? {
              ...processedValues.lapsus,
              tanggal:
                processedValues.lapsus.tanggal instanceof Date
                  ? processedValues.lapsus.tanggal.toISOString()
                  : processedValues.lapsus.tanggal
            }
          : undefined
      };

      const endpoint = initialData
        ? `/api/social-media-manager/reports/${initialData.id}`
        : '/api/social-media-manager/reports';

      const method = initialData ? 'PUT' : 'POST';

      console.log('Sending data to API:', {
        endpoint,
        method,
        data: dataToSend
      });

      const res = await apiFetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('API Response status:', res.status);
      const responseText = await res.text();
      console.log('API Response text:', responseText);

      if (!res.ok) {
        let errorMessage = 'Gagal menyimpan laporan';

        try {
          const error = JSON.parse(responseText);
          console.error('Error submitting form:', error);

          // Check for specific error messages
          if (error.error) {
            errorMessage = error.error;
          }

          // Check for Prisma unique constraint error
          if (
            responseText.includes(
              'Unique constraint failed on the fields: (`reportNo`)'
            )
          ) {
            errorMessage = `Nomor laporan "${values.reportNo}" sudah digunakan. Silakan gunakan nomor yang berbeda.`;
          }
        } catch (e) {
          console.error('Error parsing response:', responseText);

          // Try to extract error from raw text
          if (
            responseText.includes(
              'Unique constraint failed on the fields: (`reportNo`)'
            )
          ) {
            errorMessage = `Nomor laporan "${values.reportNo}" sudah digunakan. Silakan gunakan nomor yang berbeda.`;
          }
        }

        toast.error(errorMessage);
        return;
      }

      toast.success(
        initialData ? 'Laporan berhasil diperbarui' : 'Laporan berhasil dibuat'
      );

      // Use replace instead of push to prevent back navigation issues
      router.replace('/dashboard/social-media-manager/reports');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan saat menyimpan laporan');
    } finally {
      setIsSubmitting(false);
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
            <FormInput
              control={form.control}
              name='namaLaporan'
              label='Nama Laporan'
              placeholder='Masukkan nama laporan'
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
            <Button
              type='button'
              variant='default'
              className='w-full'
              onClick={() => {
                setShowSearchAktivator(true);
                setAktivatorQuery('');
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add
            </Button>
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
            <Button
              type='button'
              variant='default'
              className='w-full'
              onClick={() => {
                setShowSearchCyber(true);
                setCyberQuery('');
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add
            </Button>
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
            <Button
              type='button'
              variant='default'
              className='w-full'
              onClick={() => {
                setShowSearchTop(true);
                setTopQuery('');
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add
            </Button>
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
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex gap-4'>
          <Button
            type='submit'
            disabled={isLoading || isSubmitting}
            className='w-full'
            onClick={() => {
              console.log('Submit button clicked!');
              console.log('isLoading:', isLoading);
              console.log('isSubmitting:', isSubmitting);
              console.log('Form errors:', form.formState.errors);
            }}
          >
            {isLoading || isSubmitting ? 'Menyimpan...' : 'Simpan Laporan'}
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
