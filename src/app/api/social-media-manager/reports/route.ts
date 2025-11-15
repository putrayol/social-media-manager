import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';
import { revalidatePath } from 'next/cache';

// GET - Fetch all reports
export async function GET(request: NextRequest) {
  try {
    const orgId = await requireOrganization();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build where clause for search
    const where = {
      organizationId: orgId,
      ...(search
        ? {
            OR: [
              { reportNo: { contains: search } },
              { namaLaporan: { contains: search } }
            ]
          }
        : {})
    };

    // Get total count
    const total = await prisma.socialMediaReport.count({ where });

    // Fetch paginated data
    const reports = await prisma.socialMediaReport.findMany({
      where,
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: reports,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new report
export async function POST(request: NextRequest) {
  let requestBody: any = null;

  try {
    await requireOrganizationAdmin();
    const orgId = await requireOrganization();
    requestBody = await request.json();
    const {
      reportNo,
      namaLaporan,
      tanggal,
      aktivator,
      cyberTroops,
      topKomentar,
      lapsus
    } = requestBody;

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
    const aktivatorExistingIds = extractIds(aktivator || []);
    const cyberExistingIds = extractIds(cyberTroops || []);
    const topExistingIds = extractIds(topKomentar || []);

    const aktivatorNew = (aktivator || []).filter(
      (item: any) => item?.id == null
    );
    const cyberNew = (cyberTroops || []).filter(
      (item: any) => item?.id == null
    );
    const topNew = (topKomentar || []).filter((item: any) => item?.id == null);

    // Use transaction to ensure data consistency
    const newReport = await prisma.$transaction(async (tx) => {
      // Create the report
      const report = await tx.socialMediaReport.create({
        data: {
          reportNo,
          namaLaporan: namaLaporan || null,
          tanggal: new Date(tanggal),
          organizationId: orgId,
          lapsusData: lapsus ? JSON.stringify(lapsus) : null
        }
      });

      // Link existing items to the new report
      if (aktivatorExistingIds.length > 0) {
        await tx.aktivator.updateMany({
          where: {
            id: { in: aktivatorExistingIds },
            organizationId: orgId
          },
          data: { reportId: report.id }
        });
      }

      if (cyberExistingIds.length > 0) {
        await tx.cyberTroops.updateMany({
          where: {
            id: { in: cyberExistingIds },
            organizationId: orgId
          },
          data: { reportId: report.id }
        });
      }

      if (topExistingIds.length > 0) {
        await tx.topKomentar.updateMany({
          where: {
            id: { in: topExistingIds },
            organizationId: orgId
          },
          data: { reportId: report.id }
        });
      }

      // Create new items and link them to the report
      if (aktivatorNew.length > 0) {
        await tx.aktivator.createMany({
          data: aktivatorNew.map((item: any) => ({
            reportId: report.id,
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
            reportId: report.id,
            no: item.no || 1,
            namaAkun: item.namaAkun,
            platform: item.platform,
            kategori: item.kategori,
            jenisIsu: item.jenisIsu,
            jumlahKomentar: item.jumlahKomentar || 0,
            jumlahLike: item.jumlahLike || 0,
            link: item.link || null,
            keterangan: item.keterangan || null,
            organizationId: orgId
          }))
        });
      }

      if (topNew.length > 0) {
        await tx.topKomentar.createMany({
          data: topNew.map((item: any) => ({
            reportId: report.id,
            no: item.no || 1,
            namaAkun: item.namaAkun,
            platform: item.platform,
            jumlahTopKomentar: item.jumlahTopKomentar || 0,
            jumlahLike: item.jumlahLike || 0,
            link: item.link || null,
            keterangan: item.keterangan || null,
            organizationId: orgId
          }))
        });
      }

      return report;
    });

    // Fetch the complete report with related data
    const completeReport = await prisma.socialMediaReport.findUnique({
      where: { id: newReport.id },
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    // Revalidate listing pages
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/reports');

    return NextResponse.json(
      { success: true, data: completeReport },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating report:', error);

    // Check for authentication/authorization errors
    if (error.message && error.message.includes('admin')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Anda tidak memiliki izin untuk membuat laporan. Hanya admin yang dapat membuat laporan.'
        },
        { status: 403 }
      );
    }

    if (error.message && error.message.includes('organization')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Anda harus menjadi anggota organisasi untuk membuat laporan.'
        },
        { status: 401 }
      );
    }

    // Check for Prisma unique constraint error
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      let errorMessage = 'Data sudah ada';

      if (field === 'reportNo' && requestBody?.reportNo) {
        errorMessage = `Nomor laporan "${requestBody.reportNo}" sudah digunakan. Silakan gunakan nomor yang berbeda.`;
      } else if (field === 'reportNo') {
        errorMessage =
          'Nomor laporan sudah digunakan. Silakan gunakan nomor yang berbeda.';
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create data' },
      { status: 500 }
    );
  }
}
