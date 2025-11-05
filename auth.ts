import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        // 动态导入 Node-only 依赖，避免被 Edge Runtime 打包
        const { default: postgres } = await import('postgres');
        const sql = postgres(process.env.POSTGRES_URL!, {
          ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
        });

        const rows = await sql<{
          id: string;
          name: string;
          email: string;
          password: string;
          is_vip: boolean;
          roles: string | null;
        }[]>`
          SELECT
            u.id, u.name, u.email, u.password, u.is_vip,
            COALESCE(STRING_AGG(r.name, ','), '') AS roles
          FROM users u
          LEFT JOIN user_roles ur ON ur.user_id = u.id
          LEFT JOIN roles r ON r.id = ur.role_id
          WHERE u.email = ${email}
          GROUP BY u.id
          LIMIT 1
        `;
        const user = rows[0];
        if (!user) return null;

        const bcrypt = await import('bcryptjs');
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isVip: user.is_vip,
          roles: (user.roles ?? '').split(',').filter(Boolean),
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isVip = (user as any).isVip ?? false;
        token.roles = (user as any).roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub!,
        roles: (token as any).roles ?? [],
        isVip: (token as any).isVip ?? false,
      } as any;
      return session;
    },
  },
  // 可按需自定义 cookies、pages 等
});