import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/server/db";
import { env } from "~/env";

console.log('Auth Config Environment:', {
  authSecret: env.AUTH_SECRET?.slice(0, 10) + '...',
  authTrustHost: env.AUTH_TRUST_HOST,
  authUrl: env.AUTH_URL,
  nextAuthUrl: env.NEXTAUTH_URL,
  googleClientId: env.GOOGLE_CLIENT_ID?.slice(0, 10) + '...',
  nodeEnv: env.NODE_ENV,
});

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  secret: env.AUTH_SECRET,
  trustHost: true,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      console.log('Session Callback:', { sessionUser: session.user, dbUser: user });
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    signIn: ({ user, account, profile }) => {
      console.log('SignIn Callback:', { 
        user: { ...user, email: user.email },
        accountType: account?.type,
        accountProvider: account?.provider,
        profileEmail: profile?.email
      });
      return true;
    },
    redirect: ({ url, baseUrl }) => {
      console.log('Redirect Callback:', { 
        url, 
        baseUrl,
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        authUrl: process.env.AUTH_URL,
      });
      
      // Allow redirects to any *.vercel.app domain
      if (url.startsWith(baseUrl) || url.includes('.vercel.app')) {
        console.log('Allowing redirect to:', url);
        return url;
      }
      
      // Redirect to production URL by default
      const defaultUrl = 'https://airtable-clone-alpha-six.vercel.app';
      console.log('Falling back to default URL:', defaultUrl);
      return defaultUrl;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin?error=true",
  },
  logger: {
    error: (code, ...message) => {
      console.error('NextAuth Error:', { code, message, env: process.env.NODE_ENV });
    },
    warn: (code, ...message) => {
      console.warn('NextAuth Warning:', { code, message, env: process.env.NODE_ENV });
    },
    debug: (code, ...message) => {
      console.log('NextAuth Debug:', { code, message, env: process.env.NODE_ENV });
    },
  },
} satisfies NextAuthConfig;
