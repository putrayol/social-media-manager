'use client';

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
import { Edit } from 'lucide-react';
import Link from 'next/link';
import ReportActions from '@/features/social-media-manager/components/report-actions';
import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

interface ViewReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewReportPage({ params }: ViewReportPageProps) {
  const { organization, isLoaded } = useOrganization();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportId, setReportId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => setReportId(id));
  }, [params]);

  useEffect(() => {
    if (!isLoaded || !reportId) return;

    if (!organization) {
      console.log('[ViewReportPage] No organization loaded yet');
      setIsLoading(false);
      return;
    }

    console.log(
      '[ViewReportPage] Fetching report:',
      reportId,
      'for organization:',
      organization.id
    );

    async function fetchReport() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `/api/social-media-manager/reports/${reportId}`
        );
        if (res.ok) {
          const json = await res.json();
          setReport(json.data || json);
        } else {
          setReport(null);
        }
      } catch (error) {
        console.error('[ViewReportPage] Error fetching report:', error);
        setReport(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, [organization, isLoaded, reportId]);

  if (!isLoaded || isLoading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Loading...</h2>
          </div>
        </div>
      </PageContainer>
    );
  }

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
              {new Date(report.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className='flex gap-2'>
            <ReportActions reportId={report.id} reportNo={report.reportNo} />
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

        <div id='report-content' className='space-y-4'>
          {/* Sections AC: Aktivitas Media Sosial */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Aktivitas Media Sosial</CardTitle>
            </CardHeader>
            <CardContent>
              {(report.aktivator && report.aktivator.length > 0) ||
              (report.cyberTroops && report.cyberTroops.length > 0) ||
              (report.topKomentar && report.topKomentar.length > 0) ? (
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NO</TableHead>
                        <TableHead>NAMA AKUN</TableHead>
                        <TableHead>PLATFORM</TableHead>
                        <TableHead>JENIS / KATEGORI</TableHead>
                        <TableHead>JENIS ISU</TableHead>
                        <TableHead>JUMLAH</TableHead>
                        <TableHead>LINK</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.aktivator && report.aktivator.length > 0 && (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className='bg-muted font-semibold'
                            >
                              A. Social Media Aktivator (Report Giat Konten)
                            </TableCell>
                          </TableRow>
                          {report.aktivator.map((item: any) => (
                            <TableRow key={`aktivator-${item.id}`}>
                              <TableCell>{item.no}</TableCell>
                              <TableCell>{item.namaAkun}</TableCell>
                              <TableCell>
                                <Badge variant='outline'>{item.platform}</Badge>
                              </TableCell>
                              <TableCell>{item.jenisKonten}</TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
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
                        </>
                      )}

                      {report.cyberTroops && report.cyberTroops.length > 0 && (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className='bg-muted font-semibold'
                            >
                              B. Cyber Troops (Report Giat Buzzer)
                            </TableCell>
                          </TableRow>
                          {report.cyberTroops.map((item: any) => (
                            <TableRow key={`cyber-${item.id}`}>
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
                          <TableRow className='bg-muted font-semibold'>
                            <TableCell colSpan={5} className='text-left'>
                              TOTAL
                            </TableCell>
                            <TableCell>
                              {report.cyberTroops.reduce(
                                (sum: number, item: any) =>
                                  sum + (item.jumlahKomentar || 0),
                                0
                              )}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </>
                      )}

                      {report.topKomentar && report.topKomentar.length > 0 && (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className='bg-muted font-semibold'
                            >
                              C. Report Giat Top Komentar Postingan
                            </TableCell>
                          </TableRow>
                          {report.topKomentar.map((item: any) => (
                            <TableRow key={`topkomentar-${item.id}`}>
                              <TableCell>{item.no}</TableCell>
                              <TableCell>{item.namaAkun}</TableCell>
                              <TableCell>
                                <Badge variant='outline'>{item.platform}</Badge>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
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
                          <TableRow className='bg-muted font-semibold'>
                            <TableCell colSpan={5} className='text-left'>
                              TOTAL
                            </TableCell>
                            <TableCell>
                              {report.topKomentar.reduce(
                                (sum: number, item: any) =>
                                  sum + (item.jumlahTopKomentar || 0),
                                0
                              )}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className='text-muted-foreground'>Tidak ada data</p>
              )}
            </CardContent>
          </Card>

          {/* Section D: Lapsus */}
          {report.lapsusData && (
            <Card>
              <CardHeader>
                <CardTitle>D. Laporan Khusus (LAPSUS)</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='mb-2 font-semibold'>Keterangan:</p>
                  <p className='text-sm'>
                    {JSON.parse(report.lapsusData).keterangan}
                  </p>
                </div>
                {JSON.parse(report.lapsusData).documentFiles &&
                  JSON.parse(report.lapsusData).documentFiles.length > 0 && (
                    <div>
                      <p className='mb-2 font-semibold'>Dokumen Pendukung:</p>
                      <ul className='space-y-2'>
                        {JSON.parse(report.lapsusData).documentFiles.map(
                          (file: any, index: number) => (
                            <li
                              key={file.id || file.fileName || index}
                              className='text-sm'
                            >
                              <a
                                href={file.fileUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline'
                              >
                                {file.fileName}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
