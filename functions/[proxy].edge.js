export default async function handler(request, context) {
  const modifiedUrl = new URL(request.url);
  const route = modifiedUrl.pathname;

  if (route === "/about") {
    const redirectHost = context.env.REDIRECT_HOST;
    const redirectUrl = new URL(redirectHost);
    return Response.redirect(redirectUrl, 302);
  }

  return fetch(request);
}
// Deployment test #1 - 2026-01-20 12:48:46
// Deployment test #2 - 2026-01-20 12:48:53
// Deployment test #3 - 2026-01-20 12:48:59
// Deployment test #4 - 2026-01-20 12:49:06
// Deployment test #5 - 2026-01-20 12:49:12
// Deployment test #6 - 2026-01-20 12:49:19
// Deployment test #7 - 2026-01-20 12:49:25
// Deployment test #8 - 2026-01-20 12:49:32
// Deployment test #9 - 2026-01-20 12:49:39
// Deployment test #10 - 2026-01-20 12:49:45
// Deployment test #1 - 2026-01-20 12:57:07
// Deployment test #1 - 2026-01-20 13:50:47
// Deployment test #1 - 2026-01-20 13:59:43
// Deployment test #2 - 2026-01-20 14:03:45
// Deployment test #3 - 2026-01-20 14:07:46
// Deployment test #4 - 2026-01-20 14:11:48
// Deployment test #5 - 2026-01-20 14:15:49
