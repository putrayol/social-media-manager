import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Download, Printer, Edit } from 'lucide-react';
import Link from 'next/link';
import { mockReports } from '@/features/social-media-manager/utils/mock-reports';

interface ViewReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewReportPage({ params }: ViewReportPageProps) {
  // TODO: Fetch data from API
  const { id } = await params;
  const report = mockReports.find((item) => item.id === id);

  if (!report) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Laporan tidak ditemukan</h2>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              {report.reportNo} - Laporan Media Sosial
            </h2>
            <p className='text-muted-foreground'>
              {report.tanggal.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline'>
              <Printer className='mr-2 h-4 w-4' />
              Print
            </Button>
            <Button variant='outline'>
              <Download className='mr-2 h-4 w-4' />
              Export PDF
            </Button>
            <Link
              href={`/dashboard/social-media-manager/reports/${report.id}/edit`}
            >
              <Button>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Section A: Aktivator */}
        <Card>
          <CardHeader>
            <CardTitle>
              A. Social Media Aktivator (Report Giat Konten)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.aktivator && report.aktivator.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NO</TableHead>
                      <TableHead>NAMA AKUN</TableHead>
                      <TableHead>PLATFORM</TableHead>
                      <TableHead>JENIS KONTEN</TableHead>
                      <TableHead>LINK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.aktivator.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.no}</TableCell>
                        <TableCell>{item.namaAkun}</TableCell>
                        <TableCell>
                          <Badge variant='outline'>{item.platform}</Badge>
                        </TableCell>
                        <TableCell>{item.jenisKonten}</TableCell>
                        <TableCell>
                          <a
                            href={item.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            LINK
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className='text-muted-foreground'>Tidak ada data</p>
            )}
          </CardContent>
        </Card>

        {/* Section B: Cyber Troops */}
        <Card>
          <CardHeader>
            <CardTitle>B. Cyber Troops (Report Giat Buzzer)</CardTitle>
          </CardHeader>
          <CardContent>
            {report.cyberTroops && report.cyberTroops.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NO</TableHead>
                      <TableHead>NAMA AKUN</TableHead>
                      <TableHead>PLATFORM</TableHead>
                      <TableHead>KATEGORI</TableHead>
                      <TableHead>JENIS ISU</TableHead>
                      <TableHead>JUMLAH KOMENTAR</TableHead>
                      <TableHead>LINK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.cyberTroops.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.no}</TableCell>
                        <TableCell>{item.namaAkun}</TableCell>
                        <TableCell>
                          <Badge variant='outline'>{item.platform}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.kategori === 'Positif'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {item.kategori}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.jenisIsu}</TableCell>
                        <TableCell>{item.jumlahKomentar}</TableCell>
                        <TableCell>
                          <a
                            href={item.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            LINK
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className='text-muted-foreground'>Tidak ada data</p>
            )}
          </CardContent>
        </Card>

        {/* Section C: Top Komentar */}
        <Card>
          <CardHeader>
            <CardTitle>C. Report Giat Top Komentar Postingan</CardTitle>
          </CardHeader>
          <CardContent>
            {report.topKomentar && report.topKomentar.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NO</TableHead>
                      <TableHead>NAMA AKUN</TableHead>
                      <TableHead>PLATFORM</TableHead>
                      <TableHead>JUMLAH TOP KOMENTAR</TableHead>
                      <TableHead>LINK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.topKomentar.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.no}</TableCell>
                        <TableCell>{item.namaAkun}</TableCell>
                        <TableCell>
                          <Badge variant='outline'>{item.platform}</Badge>
                        </TableCell>
                        <TableCell>{item.jumlahTopKomentar}</TableCell>
                        <TableCell>
                          <a
                            href={item.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            LINK
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className='text-muted-foreground'>Tidak ada data</p>
            )}
          </CardContent>
        </Card>

        {/* Section D: Lapsus */}
        {report.lapsus && (
          <Card>
            <CardHeader>
              <CardTitle>D. Laporan Khusus (LAPSUS)</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='mb-2 font-semibold'>Keterangan:</p>
                <p className='text-sm'>{report.lapsus.keterangan}</p>
              </div>
              {report.lapsus.documentFiles &&
                report.lapsus.documentFiles.length > 0 && (
                  <div>
                    <p className='mb-2 font-semibold'>Dokumen Pendukung:</p>
                    <ul className='space-y-2'>
                      {report.lapsus.documentFiles.map((file) => (
                        <li key={file.id} className='text-sm'>
                          <a
                            href={file.fileUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            {file.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
