import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerUserId } from '@/lib/server/auth';

export async function GET() {
    try {
        const ownerId = await getServerUserId();
        const warehouses = await prisma.warehouse.findMany(
            {
                include: {owner: true },
                where: {
                    ownerId: ownerId
                }
            });
        return NextResponse.json({ warehouses });
    } catch (error) {
        console.error('GET /api/warehouses error', error);
        return NextResponse.json({ error: 'Error fetching warehouses' }, { status: 500 });
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
            console.warn('POST /api/warehouses: no ownerId (unauthorized)');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            const created = await prisma.warehouse.create({
            data: {
                name: name,
                description: description,
                ownerId: ownerId,
            }
            });
            return NextResponse.json({ warehouse: created }, { status: 201 });
        } catch (e:any) {
            console.error('POST /api/warehouses prisma create error', e?.message ?? e);
            return NextResponse.json({ error: 'Error creating warehouse', detail: e?.message ?? String(e) }, { status: 500 });
        }
    } catch (error) {
        console.error('POST /api/warehouses error', error);
        return NextResponse.json({ error: 'Error creating warehouse' }, { status: 500 });
    }
}
