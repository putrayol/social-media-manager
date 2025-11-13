import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';

// GET - Fetch all cyber troops data from DB (Prisma)
export async function GET(request: NextRequest) {
  try {
    const orgId = await requireOrganization();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.max(parseInt(searchParams.get('limit') || '10'), 1);
    const search = (searchParams.get('search') || '').trim();
    const kategori = (searchParams.get('kategori') || '').trim();

    const andConditions: Prisma.CyberTroopsWhereInput[] = [
      { organizationId: orgId }
    ];
    if (search) {
      andConditions.push({
        OR: [
          {
            namaAkun: { contains: search }
          },
          { jenisIsu: { contains: search } }
        ]
      });
    }
    if (kategori) {
      andConditions.push({ kategori });
    }
    const where: Prisma.CyberTroopsWhereInput = { AND: andConditions };

    const [total, data] = await Promise.all([
      prisma.cyberTroops.count({ where }),
      prisma.cyberTroops.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return NextResponse.json({ success: true, data, total, page, limit });
  } catch (error) {
    console.error('Error fetching cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new cyber troops in DB (Prisma)
export async function POST(request: NextRequest) {
  try {
    await requireOrganizationAdmin();
    const orgId = await requireOrganization();
    const body = await request.json();
    const count = await prisma.cyberTroops.count({
      where: { organizationId: orgId }
    });
    const nextNo = Number.isFinite(Number(body.no))
      ? Number(body.no)
      : count + 1;
    const created = await prisma.cyberTroops.create({
      data: {
        no: nextNo,
        namaAkun: String(body.namaAkun),
        platform: String(body.platform).toUpperCase() as any,
        kategori: String(body.kategori),
        jenisIsu: String(body.jenisIsu),
        jumlahKomentar: Number(body.jumlahKomentar),
        link: body.link ?? null,
        keterangan: body.keterangan ?? null,
        organizationId: orgId
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating cyber troops:', error);
    if (error instanceof Error && error.message.includes('administrator')) {
      return NextResponse.json(
        { success: false, error: 'Only administrators can create data' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
