import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET - Fetch all top komentar data from DB (Prisma)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.max(parseInt(searchParams.get('limit') || '10'), 1);
    const search = (searchParams.get('search') || '').trim();

    const where: Prisma.TopKomentarWhereInput | undefined = search
      ? {
          OR: [
            {
              namaAkun: { contains: search, mode: Prisma.QueryMode.insensitive }
            },
            {
              keterangan: {
                contains: search,
                mode: Prisma.QueryMode.insensitive
              }
            }
          ]
        }
      : undefined;

    const [total, data] = await Promise.all([
      prisma.topKomentar.count({ where }),
      prisma.topKomentar.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return NextResponse.json({ success: true, data, total, page, limit });
  } catch (error) {
    console.error('Error fetching top komentar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new top komentar in DB (Prisma)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await prisma.topKomentar.count();
    const nextNo = Number.isFinite(Number(body.no))
      ? Number(body.no)
      : count + 1;
    const created = await prisma.topKomentar.create({
      data: {
        no: nextNo,
        namaAkun: String(body.namaAkun),
        platform: String(body.platform).toUpperCase() as any,
        jumlahTopKomentar: Number(body.jumlahTopKomentar),
        link: body.link ?? null,
        keterangan: body.keterangan ?? null
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating top komentar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
