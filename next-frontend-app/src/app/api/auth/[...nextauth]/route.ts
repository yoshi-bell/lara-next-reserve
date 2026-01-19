import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${process.env.BACKEND_URL}/api/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials?.email,
                                password: credentials?.password,
                            }),
                        }
                    );

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(
                            errorData.message || "認証に失敗しました。"
                        );
                    }

                    const user = await res.json();
                    // 認証成功時、ユーザーオブジェクトを返す
                    return user;
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(
                            error.message || "サーバーエラーが発生しました。"
                        );
                    }
                    throw new Error("サーバーエラーが発生しました。");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as number;
                token.email = user.email;
                // 他に必要なユーザー情報があれば追加
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as number; // 型アサーションを追加
                session.user.email = token.email;
                // 他に必要なユーザー情報があれば追加
            }
            return session;
        },
    },
    pages: {
        signIn: "/login", // ログインページのパス
    },
    session: {
        strategy: "jwt", // JWTセッション戦略を使用
    },
    secret: process.env.NEXTAUTH_SECRET, // 環境変数からシークレットキーを取得
});

export { handler as GET, handler as POST };
