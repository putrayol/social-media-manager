import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';

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
      aktivator,
      cyberTroops,
      topKomentar,
      lapsus
    } = body;

    console.log('PUT request received for report:', id);
    console.log('Request body:', JSON.stringify(body, null, 2));

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

    // Delete existing related data first
    console.log('Deleting existing data for report:', id);
    const deletedAktivator = await prisma.aktivator.deleteMany({
      where: { reportId: id }
    });
    const deletedCyberTroops = await prisma.cyberTroops.deleteMany({
      where: { reportId: id }
    });
    const deletedTopKomentar = await prisma.topKomentar.deleteMany({
      where: { reportId: id }
    });
    console.log('Deleted:', {
      deletedAktivator,
      deletedCyberTroops,
      deletedTopKomentar
    });

    // Update report data
    console.log('Updating report data');
    await prisma.socialMediaReport.update({
      where: { id },
      data: {
        reportNo,
        namaLaporan: namaLaporan || null,
        tanggal: new Date(tanggal),
        lapsusData: lapsus ? JSON.stringify(lapsus) : null
      }
    });

    // Create new related data
    console.log('Creating new related data');
    if (aktivator && aktivator.length > 0) {
      await prisma.aktivator.createMany({
        data: aktivator.map((item: any) => ({
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

    if (cyberTroops && cyberTroops.length > 0) {
      await prisma.cyberTroops.createMany({
        data: cyberTroops.map((item: any) => ({
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

    if (topKomentar && topKomentar.length > 0) {
      await prisma.topKomentar.createMany({
        data: topKomentar.map((item: any) => ({
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

    // Fetch updated report with all relations
    const finalReport = await prisma.socialMediaReport.findUnique({
      where: { id },
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    return NextResponse.json({ success: true, data: finalReport });
  } catch (error) {
    console.error('Error updating report:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
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
