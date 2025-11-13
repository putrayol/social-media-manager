'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { SocialMediaReport } from '../types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface ReportListingProps {
  reports: SocialMediaReport[];
}

export function ReportListing({ reports }: ReportListingProps) {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (reportId: string) => {
    setSelectedReport(reportId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;

    try {
      setIsDeleting(true);
      const res = await apiFetch(
        `/api/social-media-manager/reports/${selectedReport}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setShowDeleteDialog(false);
        setSelectedReport(null);
        router.refresh();
      } else {
        console.error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Daftar Laporan</h2>
          <p className='text-muted-foreground'>
            Total: {reports.length} laporan
          </p>
        </div>
        <Link href='/dashboard/social-media-manager/reports/create'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Buat Laporan Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className='pt-6'>
          {reports.length === 0 ? (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground mb-4'>Belum ada laporan</p>
              <Link href='/dashboard/social-media-manager/reports/create'>
                <Button>Buat Laporan Pertama</Button>
              </Link>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Laporan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aktivator</TableHead>
                    <TableHead>Cyber Troops</TableHead>
                    <TableHead>Top Komentar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className='font-semibold'>
                        {report.reportNo}
                      </TableCell>
                      <TableCell>
                        {new Date(report.tanggal).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {report.aktivator?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {report.cyberTroops?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {report.topKomentar?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='default'>Selesai</Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Link
                            href={`/dashboard/social-media-manager/reports/${report.id}`}
                          >
                            <Button size='sm' variant='ghost'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/social-media-manager/reports/${report.id}/edit`}
                          >
                            <Button size='sm' variant='ghost'>
                              <Edit className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className='h-4 w-4 text-red-600' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Laporan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-4'>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className='bg-red-600'
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
