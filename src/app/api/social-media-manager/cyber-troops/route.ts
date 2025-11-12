import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET - Fetch all cyber troops data from DB (Prisma)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.max(parseInt(searchParams.get('limit') || '10'), 1);
    const search = (searchParams.get('search') || '').trim();
    const kategori = (searchParams.get('kategori') || '').trim();

    const andConditions: Prisma.CyberTroopsWhereInput[] = [];
    if (search) {
      andConditions.push({
        OR: [
          {
            namaAkun: { contains: search, mode: Prisma.QueryMode.insensitive }
          },
          { jenisIsu: { contains: search, mode: Prisma.QueryMode.insensitive } }
        ]
      });
    }
    if (kategori) {
      andConditions.push({ kategori });
    }
    const where: Prisma.CyberTroopsWhereInput = andConditions.length
      ? { AND: andConditions }
      : {};

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
    const body = await request.json();
    const count = await prisma.cyberTroops.count();
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
        keterangan: body.keterangan ?? null
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
