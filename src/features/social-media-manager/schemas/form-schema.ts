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

// Social Media Aktivator Schema (simplified - only profile info)
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
  link: z
    .string()
    .url({ message: 'Link profil harus URL yang valid' })
    .or(z.literal(''))
    .optional()
    .nullable()
});

// Cyber Troops Schema (with aktivator relation)
export const cyberTroopsSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // ✅ Accept both string and number for ID
  aktivatorId: z.union([z.string(), z.number()]).optional().nullable(), // Relation to Aktivator
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
  jumlahLike: z.coerce
    .number()
    .min(0, { message: 'Jumlah like tidak boleh negatif' })
    .optional(),
  link: z
    .string()
    .url({ message: 'Link postingan harus URL yang valid' })
    .or(z.literal(''))
    .optional()
    .nullable(),
  keterangan: z.string().optional().nullable(),
  requestId: z.union([z.string(), z.number()]).optional().nullable()
});

// Top Komentar Postingan Schema (with both profile and posting links)
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
  jumlahLike: z.coerce
    .number()
    .min(0, { message: 'Jumlah like tidak boleh negatif' })
    .optional(),
  linkProfile: z
    .string()
    .url({ message: 'Link profil harus URL yang valid' })
    .or(z.literal(''))
    .optional()
    .nullable(),
  link: z
    .string()
    .url({ message: 'Link postingan harus URL yang valid' })
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
    .optional(),
  requestId: z.union([z.string(), z.number()]).optional().nullable()
});

// Request Schema
const nonNegativeNumberOptional = (fieldMessage: string) =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const num = typeof val === 'string' ? Number(val) : (val as number);
      return Number.isNaN(num) ? 0 : num;
    },
    z.number().min(0, { message: fieldMessage })
  );

export const requestSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  tanggalMulai: z.date({ message: 'Tanggal mulai harus diisi' }),
  tanggalBerakhir: z.date({ message: 'Tanggal berakhir harus diisi' }),
  namaPaket: z
    .string()
    .min(2, { message: 'Nama paket harus minimal 2 karakter' }),
  tiktokPost: nonNegativeNumberOptional(
    'Jumlah post TikTok tidak boleh negatif'
  ),
  tiktokKomen: nonNegativeNumberOptional(
    'Jumlah komen TikTok tidak boleh negatif'
  ),
  tiktokLike: nonNegativeNumberOptional(
    'Jumlah like TikTok tidak boleh negatif'
  ),
  instagramPost: nonNegativeNumberOptional(
    'Jumlah post Instagram tidak boleh negatif'
  ),
  instagramKomen: nonNegativeNumberOptional(
    'Jumlah komen Instagram tidak boleh negatif'
  ),
  instagramLike: nonNegativeNumberOptional(
    'Jumlah like Instagram tidak boleh negatif'
  ),
  facebookPost: nonNegativeNumberOptional(
    'Jumlah post Facebook tidak boleh negatif'
  ),
  facebookKomen: nonNegativeNumberOptional(
    'Jumlah komen Facebook tidak boleh negatif'
  ),
  facebookLike: nonNegativeNumberOptional(
    'Jumlah like Facebook tidak boleh negatif'
  ),
  twitterPost: nonNegativeNumberOptional(
    'Jumlah post Twitter/X tidak boleh negatif'
  ),
  twitterKomen: nonNegativeNumberOptional(
    'Jumlah komen Twitter/X tidak boleh negatif'
  ),
  twitterLike: nonNegativeNumberOptional(
    'Jumlah like Twitter/X tidak boleh negatif'
  ),
  youtubePost: nonNegativeNumberOptional(
    'Jumlah post YouTube tidak boleh negatif'
  ),
  youtubeKomen: nonNegativeNumberOptional(
    'Jumlah komen YouTube tidak boleh negatif'
  ),
  youtubeLike: nonNegativeNumberOptional(
    'Jumlah like YouTube tidak boleh negatif'
  ),
  otherPost: nonNegativeNumberOptional(
    'Jumlah post Lainnya tidak boleh negatif'
  ),
  otherKomen: nonNegativeNumberOptional(
    'Jumlah komen Lainnya tidak boleh negatif'
  ),
  otherLike: nonNegativeNumberOptional(
    'Jumlah like Lainnya tidak boleh negatif'
  ),
  bonus: z.string().optional().nullable()
});

// Laporan Khusus Schema
export const laporanKhususSchema = z.object({
  tanggal: z.date({ message: 'Tanggal harus valid' }).optional(),
  jumlahKomentar: z.coerce
    .number()
    .min(0, { message: 'Jumlah komentar tidak boleh negatif' })
    .optional(),
  jumlahPostingan: z.coerce
    .number()
    .min(0, { message: 'Jumlah postingan tidak boleh negatif' })
    .optional(),
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
export type RequestFormData = z.infer<typeof requestSchema>;
export type LaporanKhususFormData = z.infer<typeof laporanKhususSchema>;
export type SocialMediaReportFormData = z.infer<typeof socialMediaReportSchema>;
