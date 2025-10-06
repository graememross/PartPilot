import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '@/lib/prisma';

export async function getServerUserId(): Promise<string | null> {
    const session = await getServerSession(authOptions as any);
    if (!session ) return null;

    // If the session already contains the user id (authorize may include it), use it
    // @ts-ignore
    if (session.user.id) return session.user.id as string;
    return null;
}

export default getServerUserId;
