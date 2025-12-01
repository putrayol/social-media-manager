import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';
import { revalidatePath } from 'next/cache';

// GET - Fetch single cyber troops with aktivator
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
    const cyberTroops = await prisma.cyberTroops.findUnique({
      where: { id: numericId },
      include: {
        aktivator: {
          select: {
            id: true,
            namaAkun: true,
            platform: true,
            link: true
          }
        }
      }
    });
    if (!cyberTroops || cyberTroops.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: cyberTroops });
  } catch (error) {
    console.error('Error fetching cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update cyber troops
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const existing = await prisma.cyberTroops.findUnique({
      where: { id: numericId }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updated = await prisma.cyberTroops.update({
      where: { id: numericId },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
        aktivatorId:
          body.aktivatorId !== undefined
            ? body.aktivatorId !== null && body.aktivatorId !== ''
              ? Number(body.aktivatorId)
              : null
            : undefined,
        namaAkun: body.namaAkun,
        platform: body.platform
          ? (String(body.platform).toUpperCase() as any)
          : undefined,
        kategori: body.kategori,
        jenisIsu: body.jenisIsu,
        jumlahKomentar:
          body.jumlahKomentar !== undefined
            ? Number(body.jumlahKomentar)
            : undefined,
        jumlahLike:
          body.jumlahLike !== undefined ? Number(body.jumlahLike) : undefined,
        link: body.link ?? undefined,
        keterangan: body.keterangan ?? undefined,
        requestId:
          body.requestId !== undefined
            ? body.requestId !== null && body.requestId !== ''
              ? Number(body.requestId)
              : null
            : undefined
      },
      include: {
        aktivator: {
          select: {
            id: true,
            namaAkun: true,
            platform: true,
            link: true
          }
        }
      }
    });

    // Revalidate the pages that display this data
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/cyber-troops');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete cyber troops
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const existing = await prisma.cyberTroops.findUnique({
      where: { id: numericId }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = await prisma.cyberTroops.delete({
      where: { id: numericId }
    });

    // Revalidate the pages that display this data
    revalidatePath('/dashboard/social-media-manager');
    revalidatePath('/dashboard/social-media-manager/cyber-troops');

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
