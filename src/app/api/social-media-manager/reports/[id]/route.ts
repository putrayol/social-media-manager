import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';
import { revalidatePath } from 'next/cache';

// GET - Fetch single report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orgId = await requireOrganization();
    const report = await prisma.socialMediaReport.findUnique({
      where: { id },
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    if (!report || (report as any).organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Parse lapsusData if it exists
    const reportWithParsedData = {
      ...report,
      lapsus: report.lapsusData ? JSON.parse(report.lapsusData) : null
    };

    return NextResponse.json({ success: true, data: reportWithParsedData });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireOrganizationAdmin();
    const orgId = await requireOrganization();
    const body = await request.json();
    const {
      reportNo,
      namaLaporan,
      tanggal,
      aktivator = [],
      cyberTroops = [],
      topKomentar = [],
      lapsus
    } = body;

    console.log('PUT request received for report:', id);

    // Check if report exists
    const existingReport = await prisma.socialMediaReport.findUnique({
      where: { id }
    });

    if (!existingReport || (existingReport as any).organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Helper function to extract IDs from items (now numeric)
    const extractIds = (items: any[]): number[] => {
      return items
        .filter((item) => item?.id != null)
        .map((item) =>
          typeof item.id === 'number' ? item.id : parseInt(item.id, 10)
        )
        .filter((id) => !isNaN(id));
    };

    // Separate existing items (with IDs) from new items (without IDs)
    const aktivatorExistingIds = extractIds(aktivator);
    const cyberExistingIds = extractIds(cyberTroops);
    const topExistingIds = extractIds(topKomentar);

    const aktivatorNew = aktivator.filter((item: any) => item?.id == null);
    const cyberNew = cyberTroops.filter((item: any) => item?.id == null);
    const topNew = topKomentar.filter((item: any) => item?.id == null);

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update report core fields
      await tx.socialMediaReport.update({
        where: { id },
        data: {
          reportNo,
          namaLaporan: namaLaporan || null,
          tanggal: new Date(tanggal),
          lapsusData: lapsus ? JSON.stringify(lapsus) : null
        }
      });

      // Step 1: Unlink items that were previously linked to this report but are no longer selected
      // This sets reportId to null for items that were removed from the selection
      await tx.aktivator.updateMany({
        where: {
          reportId: id,
          organizationId: orgId,
          id: {
            notIn: aktivatorExistingIds.length > 0 ? aktivatorExistingIds : [-1]
          }
        },
        data: { reportId: null }
      });

      await tx.cyberTroops.updateMany({
        where: {
          reportId: id,
          organizationId: orgId,
          id: { notIn: cyberExistingIds.length > 0 ? cyberExistingIds : [-1] }
        },
        data: { reportId: null }
      });

      await tx.topKomentar.updateMany({
        where: {
          reportId: id,
          organizationId: orgId,
          id: { notIn: topExistingIds.length > 0 ? topExistingIds : [-1] }
        },
        data: { reportId: null }
      });

      // Step 2: Link existing items to this report by updating their reportId
      if (aktivatorExistingIds.length > 0) {
        await tx.aktivator.updateMany({
          where: {
            id: { in: aktivatorExistingIds },
            organizationId: orgId
          },
          data: { reportId: id }
        });
      }

      if (cyberExistingIds.length > 0) {
        await tx.cyberTroops.updateMany({
          where: {
            id: { in: cyberExistingIds },
            organizationId: orgId
          },
          data: { reportId: id }
        });
      }

      if (topExistingIds.length > 0) {
        await tx.topKomentar.updateMany({
          where: {
            id: { in: topExistingIds },
            organizationId: orgId
          },
          data: { reportId: id }
        });
      }

      // Step 3: Create new items and link them to this report
      if (aktivatorNew.length > 0) {
        await tx.aktivator.createMany({
          data: aktivatorNew.map((item: any) => ({
            reportId: id,
            no: item.no || 1,
            namaAkun: item.namaAkun,
            platform: item.platform,
            jenisKonten: item.jenisKonten,
            link: item.link || null,
            organizationId: orgId
          }))
        });
      }

      if (cyberNew.length > 0) {
        await tx.cyberTroops.createMany({
          data: cyberNew.map((item: any) => ({
            reportId: id,
            no: item.no || 1,
            namaAkun: item.namaAkun,
            platform: item.platform,
            kategori: item.kategori,
            jenisIsu: item.jenisIsu,
            jumlahKomentar: item.jumlahKomentar || 0,
            link: item.link || null,
            keterangan: item.keterangan || null,
            organizationId: orgId
          }))
        });
      }

      if (topNew.length > 0) {
        await tx.topKomentar.createMany({
          data: topNew.map((item: any) => ({
            reportId: id,
            no: item.no || 1,
            namaAkun: item.namaAkun,
            platform: item.platform,
            jumlahTopKomentar: item.jumlahTopKomentar || 0,
            link: item.link || null,
            keterangan: item.keterangan || null,
            organizationId: orgId
          }))
        });
      }
    });

    // Fetch updated report with all relations
    const finalReport = await prisma.socialMediaReport.findUnique({
      where: { id },
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    // Revalidate listing pages
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/reports');

    return NextResponse.json({ success: true, data: finalReport });
  } catch (error: any) {
    console.error('Error updating report:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);

    // Check for authentication/authorization errors
    if (errorMessage && errorMessage.includes('admin')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Anda tidak memiliki izin untuk mengubah laporan. Hanya admin yang dapat mengubah laporan.'
        },
        { status: 403 }
      );
    }

    if (errorMessage && errorMessage.includes('organization')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Anda harus menjadi anggota organisasi untuk mengubah laporan.'
        },
        { status: 401 }
      );
    }

    // Check for Prisma unique constraint error
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      let errorMsg = 'Data sudah ada';

      if (field === 'reportNo') {
        errorMsg = `Nomor laporan sudah digunakan. Silakan gunakan nomor yang berbeda.`;
      }

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: errorMessage || 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete report
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireOrganizationAdmin();
    const orgId = await requireOrganization();
    const report = await prisma.socialMediaReport.findUnique({
      where: { id }
    });

    if (!report || (report as any).organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Delete report (cascade will delete related data)
    const deletedReport = await prisma.socialMediaReport.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, data: deletedReport });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
