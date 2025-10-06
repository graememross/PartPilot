import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerUserId } from '@/lib/server/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const userId = await getServerUserId();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const existing = await prisma.project.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existing.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await request.json();
        const updated = await prisma.project.update({ where: { id }, data: body });
        return NextResponse.json({ project: updated });
    } catch (error) {
        console.error('PATCH /api/projects/[id] error', error);
        return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
    }
    }

    export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;const ownerId = await getServerUserId();
        const userId = await getServerUserId();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const existing = await prisma.project.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existing.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await prisma.project.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/projects/[id] error', error);
        return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
    }
}
