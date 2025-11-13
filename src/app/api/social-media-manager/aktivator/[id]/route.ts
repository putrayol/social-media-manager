import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';
import { revalidatePath } from 'next/cache';

// GET - Fetch single aktivator
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
    const aktivator = await prisma.aktivator.findUnique({
      where: { id: numericId }
    });

    if (!aktivator || aktivator.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: aktivator });
  } catch (error) {
    console.error('Error fetching aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update aktivator
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
    const existing = await prisma.aktivator.findUnique({
      where: { id: numericId }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updated = await prisma.aktivator.update({
      where: { id: numericId },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
        namaAkun: body.namaAkun,
        platform: body.platform
          ? (String(body.platform).toUpperCase() as any)
          : undefined,
        jenisKonten: body.jenisKonten,
        link: body.link ?? undefined
      }
    });

    // Revalidate the pages that display this data
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/aktivator');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete aktivator
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
    const existing = await prisma.aktivator.findUnique({
      where: { id: numericId }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = await prisma.aktivator.delete({ where: { id: numericId } });

    // Revalidate the pages that display this data
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/aktivator');

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
