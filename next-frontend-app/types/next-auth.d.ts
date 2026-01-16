import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// session.user の型拡張
declare module "next-auth" {
    interface Session {
        user: {
            id: number; // LaravelのIDは通常number
            // role: string; // 必要ならロールなどもここに追加
        } & DefaultSession["user"];
    }

    interface User {
        id: number;
        // role: string;
    }
}

// token の型拡張
declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        // role: string;
    }
}
