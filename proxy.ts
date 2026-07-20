import { NextResponse, type NextRequest } from "next/server";

import { adminCookieName, verifyAdminAccessToken } from "@/lib/admin/access-key";

export async function proxy(request: NextRequest) {
  const adminAccessKey = process.env.ADMIN_ACCESS_KEY;
  const { pathname } = request.nextUrl;

  if (!adminAccessKey || !pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const grantedToken = request.cookies.get(adminCookieName)?.value;

  if (await verifyAdminAccessToken(grantedToken, adminAccessKey)) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
