import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';

// GET - Fetch single cyber troops
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orgId = await requireOrganization();
    const cyberTroops = await prisma.cyberTroops.findUnique({
      where: { id: params.id }
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
  { params }: { params: { id: string } }
) {
  try {
    await requireOrganizationAdmin();
    const orgId = await requireOrganization();
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.cyberTroops.findUnique({
      where: { id: params.id }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updated = await prisma.cyberTroops.update({
      where: { id: params.id },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
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
        link: body.link ?? undefined,
        keterangan: body.keterangan ?? undefined
      }
    });
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
  { params }: { params: { id: string } }
) {
  try {
    await requireOrganizationAdmin();
    const orgId = await requireOrganization();

    // Verify ownership
    const existing = await prisma.cyberTroops.findUnique({
      where: { id: params.id }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = await prisma.cyberTroops.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
