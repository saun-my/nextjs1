import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const protectedPaths = ['/dashboard', '/learn'];

  if (protectedPaths.some((p) => nextUrl.pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL('/login', nextUrl.origin);
    url.searchParams.set('redirectTo', nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*'],
};