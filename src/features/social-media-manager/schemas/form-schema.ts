import * as z from 'zod';

const MAX_FILE_SIZE = 10000000; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Uploaded File Schema (for files that have been uploaded to server)
export const uploadedFileSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  uploadedAt: z.union([z.date(), z.string()])
});

// Social Media Aktivator Schema
export const socialMediaAktivatorSchema = z.object({
  namaAkun: z
    .string()
    .min(2, { message: 'Nama akun harus minimal 2 karakter' }),
  platform: z.enum(
    ['TIKTOK', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'YOUTUBE', 'OTHER'],
    {
      message: 'Pilih platform yang valid'
    }
  ),
  jenisKonten: z
    .string()
    .min(3, { message: 'Jenis konten harus minimal 3 karakter' }),
  link: z.string().url({ message: 'Link harus URL yang valid' }).optional()
});

// Cyber Troops Schema
export const cyberTroopsSchema = z.object({
  namaAkun: z
    .string()
    .min(2, { message: 'Nama akun harus minimal 2 karakter' }),
  platform: z.enum([
    'TIKTOK',
    'INSTAGRAM',
    'FACEBOOK',
    'TWITTER',
    'YOUTUBE',
    'OTHER'
  ]),
  kategori: z.enum(['Positif', 'Negatif']),
  jenisIsu: z
    .string()
    .min(3, { message: 'Jenis isu harus minimal 3 karakter' }),
  jumlahKomentar: z.coerce
    .number()
    .min(0, { message: 'Jumlah komentar tidak boleh negatif' }),
  link: z.string().url({ message: 'Link harus URL yang valid' }).optional(),
  keterangan: z.string().optional()
});

// Top Komentar Postingan Schema
export const topKomentarPostinganSchema = z.object({
  namaAkun: z
    .string()
    .min(2, { message: 'Nama akun harus minimal 2 karakter' }),
  platform: z.enum([
    'TIKTOK',
    'INSTAGRAM',
    'FACEBOOK',
    'TWITTER',
    'YOUTUBE',
    'OTHER'
  ]),
  jumlahTopKomentar: z.coerce
    .number()
    .min(0, { message: 'Jumlah top komentar tidak boleh negatif' }),
  link: z.string().url({ message: 'Link harus URL yang valid' }).optional(),
  keterangan: z.string().optional()
});

// Laporan Khusus Schema
export const laporanKhususSchema = z.object({
  tanggal: z.date({ message: 'Tanggal harus valid' }),
  jumlahKomentar: z.coerce
    .number()
    .min(0, { message: 'Jumlah komentar tidak boleh negatif' }),
  jumlahPostingan: z.coerce
    .number()
    .min(0, { message: 'Jumlah postingan tidak boleh negatif' }),
  keterangan: z.string().optional(),
  documentFiles: z
    .array(
      z.union([
        uploadedFileSchema,
        z.any() // Allow File objects (Web API)
      ])
    )
    .refine((files) => !files || files.length <= 10, 'Maksimal 10 file')
    .optional()
});

// Combined Report Schema
export const socialMediaReportSchema = z.object({
  reportNo: z.string().min(1, { message: 'Nomor laporan harus diisi' }),
  tanggal: z.date({ message: 'Tanggal harus valid' }),
  aktivator: z.array(socialMediaAktivatorSchema).optional(),
  cyberTroops: z.array(cyberTroopsSchema).optional(),
  topKomentar: z.array(topKomentarPostinganSchema).optional(),
  lapsus: laporanKhususSchema.optional()
});

export type SocialMediaAktivatorFormData = z.infer<
  typeof socialMediaAktivatorSchema
>;
export type CyberTroopsFormData = z.infer<typeof cyberTroopsSchema>;
export type TopKomentarPostinganFormData = z.infer<
  typeof topKomentarPostinganSchema
>;
export type LaporanKhususFormData = z.infer<typeof laporanKhususSchema>;
export type SocialMediaReportFormData = z.infer<typeof socialMediaReportSchema>;
