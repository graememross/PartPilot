import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerUserId } from '@/lib/server/auth';

export async function GET() {
    try {
        const ownerId = await getServerUserId();
        const projects = await prisma.project.findMany(
            {
                include: {owner: true },
                where: {
                    ownerId: ownerId
                }
            });
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('GET /api/projects error', error);
        return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
    }
    }

    export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description } = body;
        if (!name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ownerId = await getServerUserId();
        if (!ownerId) {
            console.warn('POST /api/projects: no ownerId (unauthorized)');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            const created = await prisma.project.create({
            data: {
                name: name,
                description: description,
                ownerId: ownerId,
                version: '0.0.1'
            }
            });
            return NextResponse.json({ project: created }, { status: 201 });
        } catch (e:any) {
            console.error('POST /api/projects prisma create error', e?.message ?? e);
            return NextResponse.json({ error: 'Error creating project', detail: e?.message ?? String(e) }, { status: 500 });
        }
    } catch (error) {
        console.error('POST /api/projects error', error);
        return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
    }
}
