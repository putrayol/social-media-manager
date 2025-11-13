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
  id: z.union([z.string(), z.number()]).optional(), // ✅ Accept both string and number for ID
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
  link: z
    .string()
    .url({ message: 'Link harus URL yang valid' })
    .or(z.literal(''))
    .optional()
    .nullable()
});

// Cyber Troops Schema
export const cyberTroopsSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // ✅ Accept both string and number for ID
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
  link: z
    .string()
    .url({ message: 'Link harus URL yang valid' })
    .or(z.literal(''))
    .optional()
    .nullable(),
  keterangan: z.string().optional().nullable()
});

// Top Komentar Postingan Schema
export const topKomentarPostinganSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // ✅ Accept both string and number for ID
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
  link: z
    .string()
    .url({ message: 'Link harus URL yang valid' })
    .or(z.literal(''))
    .optional()
    .nullable(),
  keterangan: z.string().optional().nullable(),
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

// Laporan Khusus Schema
export const laporanKhususSchema = z.object({
  tanggal: z.date({ message: 'Tanggal harus valid' }),
  jumlahKomentar: z.coerce
    .number()
    .min(0, { message: 'Jumlah komentar tidak boleh negatif' }),
  jumlahPostingan: z.coerce
    .number()
    .min(0, { message: 'Jumlah postingan tidak boleh negatif' }),
  keterangan: z.string().optional().nullable(),
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

// ✅ Schema for report items that can be either:
// 1. Existing items from DB (only ID)
// 2. New items (full data without ID)
const reportAktivatorSchema = z.union([
  z.object({ id: z.union([z.string(), z.number()]) }), // Existing item - only ID
  socialMediaAktivatorSchema // New item - full data
]);

const reportCyberTroopsSchema = z.union([
  z.object({ id: z.union([z.string(), z.number()]) }), // Existing item - only ID
  cyberTroopsSchema // New item - full data
]);

const reportTopKomentarSchema = z.union([
  z.object({ id: z.union([z.string(), z.number()]) }), // Existing item - only ID
  topKomentarPostinganSchema // New item - full data
]);

// Combined Report Schema
export const socialMediaReportSchema = z.object({
  reportNo: z.string().min(1, { message: 'Nomor laporan harus diisi' }),
  namaLaporan: z.string().optional(),
  tanggal: z.date({ message: 'Tanggal harus valid' }),
  aktivator: z.array(reportAktivatorSchema).optional(),
  cyberTroops: z.array(reportCyberTroopsSchema).optional(),
  topKomentar: z.array(reportTopKomentarSchema).optional(),
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
