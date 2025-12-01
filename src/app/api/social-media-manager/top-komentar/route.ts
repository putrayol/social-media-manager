import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';

// GET - Fetch all top komentar data from DB (Prisma)
export async function GET(request: NextRequest) {
  try {
    const orgId = await requireOrganization();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.max(parseInt(searchParams.get('limit') || '10'), 1);
    const search = (searchParams.get('search') || '').trim();

    const where: Prisma.TopKomentarWhereInput = {
      organizationId: orgId,
      ...(search
        ? {
            OR: [
              {
                namaAkun: { contains: search }
              },
              {
                keterangan: {
                  contains: search
                }
              }
            ]
          }
        : {})
    };

    const [total, rawData] = await Promise.all([
      prisma.topKomentar.count({ where }),
      prisma.topKomentar.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    // Parse documentFilesData for each item
    const data = rawData.map((item) => ({
      ...item,
      documentFiles: item.documentFilesData
        ? JSON.parse(item.documentFilesData)
        : []
    }));

    return NextResponse.json({ success: true, data, total, page, limit });
  } catch (error) {
    console.error('Error fetching top komentar:', error);

    // Check if error is from requireOrganization
    if (error instanceof Error && error.message.includes('organization')) {
      return NextResponse.json(
        { success: false, error: 'Please select an organization first' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new top komentar in DB (Prisma)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission first
    await requireOrganizationAdmin();

    const orgId = await requireOrganization();
    const body = await request.json();
    const count = await prisma.topKomentar.count({
      where: { organizationId: orgId }
    });
    const nextNo = Number.isFinite(Number(body.no))
      ? Number(body.no)
      : count + 1;
    const created = await prisma.topKomentar.create({
      data: {
        no: nextNo,
        namaAkun: String(body.namaAkun),
        platform: String(body.platform).toUpperCase() as any,
        jumlahTopKomentar: Number(body.jumlahTopKomentar),
        jumlahLike: Number(body.jumlahLike ?? 0),
        linkProfile: body.linkProfile ?? null,
        link: body.link ?? null,
        keterangan: body.keterangan ?? null,
        documentFilesData: body.documentFiles
          ? JSON.stringify(body.documentFiles)
          : null,
        requestId:
          body.requestId !== undefined && body.requestId !== null
            ? Number(body.requestId)
            : null,
        organizationId: orgId
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating top komentar:', error);

    // Check if error is from requireOrganizationAdmin
    if (error instanceof Error && error.message.includes('administrator')) {
      return NextResponse.json(
        { success: false, error: 'Only administrators can create data' },
        { status: 403 }
      );
    }

    // Check if error is from requireOrganization
    if (error instanceof Error && error.message.includes('organization')) {
      return NextResponse.json(
        { success: false, error: 'Please select an organization first' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
