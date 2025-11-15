import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';
import { revalidatePath } from 'next/cache';

// GET - Fetch single request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = await requireOrganization();
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const item = await prisma.request.findUnique({
      where: { id: numericId }
    });

    if (!item || item.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin permission first
    await requireOrganizationAdmin();

    const orgId = await requireOrganization();
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Verify ownership
    const existing = await prisma.request.findUnique({
      where: { id: numericId }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updated = await prisma.request.update({
      where: { id: numericId },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
        tanggalMulai: body.tanggalMulai
          ? new Date(body.tanggalMulai)
          : undefined,
        tanggalBerakhir: body.tanggalBerakhir
          ? new Date(body.tanggalBerakhir)
          : undefined,
        namaPaket: body.namaPaket ?? undefined,
        tiktokPost:
          body.tiktokPost !== undefined ? Number(body.tiktokPost) : undefined,
        tiktokKomen:
          body.tiktokKomen !== undefined ? Number(body.tiktokKomen) : undefined,
        tiktokLike:
          body.tiktokLike !== undefined ? Number(body.tiktokLike) : undefined,
        instagramPost:
          body.instagramPost !== undefined
            ? Number(body.instagramPost)
            : undefined,
        instagramKomen:
          body.instagramKomen !== undefined
            ? Number(body.instagramKomen)
            : undefined,
        instagramLike:
          body.instagramLike !== undefined
            ? Number(body.instagramLike)
            : undefined,
        facebookPost:
          body.facebookPost !== undefined
            ? Number(body.facebookPost)
            : undefined,
        facebookKomen:
          body.facebookKomen !== undefined
            ? Number(body.facebookKomen)
            : undefined,
        facebookLike:
          body.facebookLike !== undefined
            ? Number(body.facebookLike)
            : undefined,
        twitterPost:
          body.twitterPost !== undefined ? Number(body.twitterPost) : undefined,
        twitterKomen:
          body.twitterKomen !== undefined
            ? Number(body.twitterKomen)
            : undefined,
        twitterLike:
          body.twitterLike !== undefined ? Number(body.twitterLike) : undefined,
        youtubePost:
          body.youtubePost !== undefined ? Number(body.youtubePost) : undefined,
        youtubeKomen:
          body.youtubeKomen !== undefined
            ? Number(body.youtubeKomen)
            : undefined,
        youtubeLike:
          body.youtubeLike !== undefined ? Number(body.youtubeLike) : undefined,
        otherPost:
          body.otherPost !== undefined ? Number(body.otherPost) : undefined,
        otherKomen:
          body.otherKomen !== undefined ? Number(body.otherKomen) : undefined,
        otherLike:
          body.otherLike !== undefined ? Number(body.otherLike) : undefined,
        bonus: body.bonus ?? undefined
      }
    });

    // Revalidate the pages that display this data
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/request');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin permission first
    await requireOrganizationAdmin();

    const orgId = await requireOrganization();
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.request.findUnique({
      where: { id: numericId }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = await prisma.request.delete({ where: { id: numericId } });

    // Revalidate the pages that display this data
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/request');

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
