import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';

// GET - Fetch all request data from DB (Prisma)
export async function GET(request: NextRequest) {
  try {
    const orgId = await requireOrganization();
    const searchParams = request.nextUrl.searchParams;

    // Safely parse pagination params to avoid NaN values causing Prisma errors
    const parsePositiveInt = (value: string | null, defaultValue: number) => {
      if (!value) return defaultValue;
      const parsed = parseInt(value, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
    };

    const page = parsePositiveInt(searchParams.get('page'), 1);
    const limit = parsePositiveInt(searchParams.get('limit'), 10);
    const search = (searchParams.get('search') || '').trim();

    const where: Prisma.RequestWhereInput = {
      organizationId: orgId,
      ...(search
        ? {
            OR: [
              {
                namaPaket: { contains: search }
              },
              {
                bonus: {
                  contains: search
                }
              }
            ]
          }
        : {})
    };

    const [total, data] = await Promise.all([
      prisma.request.count({ where }),
      prisma.request.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return NextResponse.json({ success: true, data, total, page, limit });
  } catch (error) {
    console.error('Error fetching request:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'UnknownError'
    });

    // Check if error is from requireOrganization
    if (error instanceof Error && error.message.includes('organization')) {
      return NextResponse.json(
        { success: false, error: 'Please select an organization first' },
        { status: 403 }
      );
    }

    // In development, include additional error detail to help debugging
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch data',
          detail: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new request in DB (Prisma)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission first
    await requireOrganizationAdmin();

    const orgId = await requireOrganization();
    const body = await request.json();
    const count = await prisma.request.count({
      where: { organizationId: orgId }
    });
    const nextNo = Number.isFinite(Number(body.no))
      ? Number(body.no)
      : count + 1;

    const created = await prisma.request.create({
      data: {
        no: nextNo,
        tanggalMulai: body.tanggalMulai
          ? new Date(body.tanggalMulai)
          : new Date(),
        tanggalBerakhir: body.tanggalBerakhir
          ? new Date(body.tanggalBerakhir)
          : new Date(),
        namaPaket: String(body.namaPaket),
        tiktokPost: Number(body.tiktokPost) || 0,
        tiktokKomen: Number(body.tiktokKomen) || 0,
        tiktokLike: Number(body.tiktokLike) || 0,
        instagramPost: Number(body.instagramPost) || 0,
        instagramKomen: Number(body.instagramKomen) || 0,
        instagramLike: Number(body.instagramLike) || 0,
        facebookPost: Number(body.facebookPost) || 0,
        facebookKomen: Number(body.facebookKomen) || 0,
        facebookLike: Number(body.facebookLike) || 0,
        twitterPost: Number(body.twitterPost) || 0,
        twitterKomen: Number(body.twitterKomen) || 0,
        twitterLike: Number(body.twitterLike) || 0,
        youtubePost: Number(body.youtubePost) || 0,
        youtubeKomen: Number(body.youtubeKomen) || 0,
        youtubeLike: Number(body.youtubeLike) || 0,
        otherPost: Number(body.otherPost) || 0,
        otherKomen: Number(body.otherKomen) || 0,
        otherLike: Number(body.otherLike) || 0,
        bonus: body.bonus ?? null,
        organizationId: orgId
      }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);

    // Check if error is from requireOrganizationAdmin
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
