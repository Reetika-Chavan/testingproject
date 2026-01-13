export default async function handler(request) {
  const modifiedUrl = new URL(request.url);
  const route = modifiedUrl.pathname;

  if (route === "/about") {
    modifiedUrl.pathname = "/contact";
    return Response.redirect(modifiedUrl, 302);
  }

  return fetch(request);
}
