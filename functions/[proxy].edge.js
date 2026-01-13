export default async function handler(request) {
  const url = new URL(request.url);

  if (url.pathname === "/about") {
    return Response.redirect(new URL("/contact", request.url), 302);
  }

  // Pass through all other requests
  return;
}

export const config = {
  path: "/*",
};
