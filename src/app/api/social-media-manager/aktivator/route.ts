import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET - Fetch all aktivator data from DB (Prisma)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.max(parseInt(searchParams.get('limit') || '10'), 1);
    const search = (searchParams.get('search') || '').trim();

    const where: Prisma.AktivatorWhereInput | undefined = search
      ? {
          OR: [
            {
              namaAkun: { contains: search }
            },
            {
              jenisKonten: {
                contains: search
              }
            }
          ]
        }
      : undefined;

    const [total, data] = await Promise.all([
      prisma.aktivator.count({ where }),
      prisma.aktivator.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return NextResponse.json({ success: true, data, total, page, limit });
  } catch (error) {
    console.error('Error fetching aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new aktivator in DB (Prisma)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await prisma.aktivator.count();
    const nextNo = Number.isFinite(Number(body.no))
      ? Number(body.no)
      : count + 1;
    const created = await prisma.aktivator.create({
      data: {
        no: nextNo,
        namaAkun: String(body.namaAkun),
        platform: String(body.platform).toUpperCase() as any,
        jenisKonten: String(body.jenisKonten),
        link: body.link ?? null
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
