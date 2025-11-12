import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch single report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.socialMediaReport.findUnique({
      where: { id: params.id },
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    if (!report) {
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { reportNo, tanggal, aktivator, cyberTroops, topKomentar, lapsus } =
      body;

    // Check if report exists
    const existingReport = await prisma.socialMediaReport.findUnique({
      where: { id: params.id }
    });

    if (!existingReport) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Delete existing related data
    await prisma.aktivator.deleteMany({ where: { reportId: params.id } });
    await prisma.cyberTroops.deleteMany({ where: { reportId: params.id } });
    await prisma.topKomentar.deleteMany({ where: { reportId: params.id } });

    // Update report with new data
    const updatedReport = await prisma.socialMediaReport.update({
      where: { id: params.id },
      data: {
        reportNo,
        tanggal: new Date(tanggal),
        lapsusData: lapsus ? JSON.stringify(lapsus) : null,
        aktivator: aktivator
          ? {
              createMany: {
                data: aktivator.map((item: any) => ({
                  no: item.no || 1,
                  namaAkun: item.namaAkun,
                  platform: item.platform,
                  jenisKonten: item.jenisKonten,
                  link: item.link || null
                }))
              }
            }
          : undefined,
        cyberTroops: cyberTroops
          ? {
              createMany: {
                data: cyberTroops.map((item: any) => ({
                  no: item.no || 1,
                  namaAkun: item.namaAkun,
                  platform: item.platform,
                  kategori: item.kategori,
                  jenisIsu: item.jenisIsu,
                  jumlahKomentar: item.jumlahKomentar || 0,
                  link: item.link || null,
                  keterangan: item.keterangan || null
                }))
              }
            }
          : undefined,
        topKomentar: topKomentar
          ? {
              createMany: {
                data: topKomentar.map((item: any) => ({
                  no: item.no || 1,
                  namaAkun: item.namaAkun,
                  platform: item.platform,
                  jumlahTopKomentar: item.jumlahTopKomentar || 0,
                  link: item.link || null,
                  keterangan: item.keterangan || null
                }))
              }
            }
          : undefined
      },
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    return NextResponse.json({ success: true, data: updatedReport });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.socialMediaReport.findUnique({
      where: { id: params.id }
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Delete report (cascade will delete related data)
    const deletedReport = await prisma.socialMediaReport.delete({
      where: { id: params.id }
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
