import { SocialMediaReport } from '../types';

export const mockReports: SocialMediaReport[] = [
  {
    id: '1',
    reportNo: '#088',
    tanggal: new Date('2025-11-11'),
    aktivator: [
      {
        id: 1,
        no: 1,
        namaAkun: 'jangganpaniknya_',
        platform: 'TIKTOK',
        link: 'https://tiktok.com/video/1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    cyberTroops: [
      {
        id: 1,
        no: 1,
        namaAkun: 'jangganpaniknya_',
        platform: 'TIKTOK',
        kategori: 'Positif',
        jenisIsu: 'Nikita Mirzani',
        jumlahKomentar: 160,
        jumlahLike: 50,
        link: 'https://tiktok.com/video/1',
        keterangan: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        no: 2,
        namaAkun: 'tessa_mariaelysah',
        platform: 'TIKTOK',
        kategori: 'Positif',
        jenisIsu: 'Nikita Mirzani',
        jumlahKomentar: 160,
        jumlahLike: 50,
        link: 'https://tiktok.com/video/2',
        keterangan: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        no: 3,
        namaAkun: 'diazfahn95',
        platform: 'TIKTOK',
        kategori: 'Negatif',
        jenisIsu: 'Nikita Mirzani',
        jumlahKomentar: 160,
        jumlahLike: 50,
        link: 'https://tiktok.com/video/3',
        keterangan: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    topKomentar: [
      {
        id: 1,
        no: 1,
        namaAkun: 'cumicumi.com_insta',
        platform: 'INSTAGRAM',
        jumlahTopKomentar: 50,
        jumlahLike: 100,
        link: 'https://instagram.com/post/1',
        keterangan: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        no: 2,
        namaAkun: 'likunjuk.sak01',
        platform: 'TIKTOK',
        jumlahTopKomentar: 50,
        jumlahLike: 100,
        link: 'https://tiktok.com/video/1',
        keterangan: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    lapsus: {
      id: '1',
      tanggal: new Date('2025-11-11'),
      jumlahKomentar: 1500,
      jumlahPostingan: 1,
      keterangan:
        'Report Komentar Cyber Troops mencapai 1.500 Komentar, 1 Postingan Konten Video. Giat ini dilakukan dengan membawa narasi Negatif mengenai Nikita Mirzani di persidangan yang menghadirkan salah satu Dr Reza Gladys.',
      documentFiles: [
        {
          id: '1',
          fileName: 'Cyber Troops (Daily Reports, Screenshot Komentar)',
          fileUrl: '/documents/cyber-troops.pdf',
          fileType: 'application/pdf',
          fileSize: 2048000,
          uploadedAt: new Date()
        },
        {
          id: '2',
          fileName: 'Top Komentar',
          fileUrl: '/documents/top-komentar.pdf',
          fileType: 'application/pdf',
          fileSize: 1024000,
          uploadedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date('2025-11-11'),
    updatedAt: new Date('2025-11-11')
  }
];
