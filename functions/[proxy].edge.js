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
