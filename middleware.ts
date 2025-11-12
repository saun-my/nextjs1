import { auth } from '@/auth';

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;
//   const protectedPaths = ['/dashboard', '/learn'];

//   if (protectedPaths.some((p) => nextUrl.pathname.startsWith(p)) && !isLoggedIn) {
//     const url = new URL('/login', nextUrl.origin);
//     url.searchParams.set('redirectTo', nextUrl.pathname);
//     return Response.redirect(url);
//   }
// });
export default auth(() => {
  // 不再拦截未登录用户，直接放行
});

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*'],
};