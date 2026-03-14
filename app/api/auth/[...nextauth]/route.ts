/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "user-login",
            name: "User Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@tripnexa.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role || "user",
                } as any;
            },
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Admin Login",
            credentials: {
                email: { label: "Admin Email", type: "email", placeholder: "admin@tripnexa.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const admin = await Admin.findOne({ email: credentials.email });

                if (!admin || !admin.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: admin._id.toString(),
                    name: "Admin",
                    email: admin.email,
                    role: "admin",
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "tripnexa_super_secret_key_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
