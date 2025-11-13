'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Download, RotateCw } from 'lucide-react';
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ReportListingProps {
  reports: SocialMediaReport[];
  onRefresh?: () => void;
}

export function ReportListing({ reports, onRefresh }: ReportListingProps) {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDelete = (reportId: string) => {
    setSelectedReport(reportId);
    setShowDeleteDialog(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    // Reset after a short delay to show the animation
    setTimeout(() => setIsRefreshing(false), 500);
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
      {/* ✅ Header with Button Group */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Daftar Laporan</h2>
          <p className='text-muted-foreground'>
            Total: {reports.length} laporan
          </p>
        </div>
        {/* ✅ Button Group */}
        <div className='bg-background flex gap-1 rounded-lg border p-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='gap-2'
          >
            <RotateCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Link href='/dashboard/social-media-manager/reports/create'>
            <Button variant='ghost' size='sm' className='gap-2'>
              <Plus className='h-4 w-4' />
              Buat Laporan Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* ✅ Table - Standalone without Card */}
      {reports.length === 0 ? (
        <div className='rounded-lg border py-8 text-center'>
          <p className='text-muted-foreground mb-4'>Belum ada laporan</p>
          <Link href='/dashboard/social-media-manager/reports/create'>
            <Button>Buat Laporan Pertama</Button>
          </Link>
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg border'>
          <ScrollArea className='w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
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
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      )}

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
