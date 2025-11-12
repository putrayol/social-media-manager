import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { reportNo: { contains: search } },
            { tanggal: { contains: search } }
          ]
        }
      : {};

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
  try {
    const body = await request.json();
    const { reportNo, tanggal, aktivator, cyberTroops, topKomentar, lapsus } =
      body;

    // Create report with related data
    const newReport = await prisma.socialMediaReport.create({
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

    return NextResponse.json(
      { success: true, data: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
