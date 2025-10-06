import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from '@/lib/prisma';
import { updateStoresEtc } from "../register/route";

const authOptions = {
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            password: {},
            email: {},
        },
        async authorize(credentials, req) {
            const user = await prisma.user.findUnique({ where: { email: credentials.email } });
            if (!user) return null;
            const passwordCorrect = await compare(credentials.password, user.password);
            updateStoresEtc(user)
            if (passwordCorrect) return { id: user.id, name: user.name, email: user.email, image: user.image };
            return null;
        }
        })
    ],
    session: { strategy: 'jwt' }
};

// Include user id in JWT and session
authOptions.callbacks = {
    async jwt({ token, user }) {
        // `user` is available on sign in
        if (user && (user as any).id) {
            (token as any).id = (user as any).id;
        }
        return token;
    },
    async session({ session, token }) {
        // @ts-ignore
        if (token && (token as any).id) session.user.id = (token as any).id;
        return session;
    }
};

export default authOptions;
