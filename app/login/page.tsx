'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') || '/learn';
  const [email, setEmail] = useState('user@nextmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      callbackUrl: redirectTo,
      redirect: false,
    });

    if (res?.ok) {
      // router.push(res.url ?? redirectTo);
            // 登录成功后，跳转并强制刷新，确保服务端读取最新 Cookie/会话
      router.replace(redirectTo);
      router.refresh();
    } else {
      setError('账号或密码不正确，请检查邮箱和密码。');
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-lg border bg-white p-6 shadow"
    >
      <h1 className="mb-4 text-xl font-semibold">登录</h1>
      <label className="mb-2 block text-sm text-gray-600">邮箱</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded border p-2"
        placeholder="you@example.com"
        required
      />
      <label className="mb-2 block text-sm text-gray-600">密码</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full rounded border p-2"
        placeholder="••••••"
        required
      />
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? '登录中...' : '登录'}
      </button>
      <p className="mt-3 text-xs text-gray-500">
        默认账户：user@nextmail.com / 123456
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}