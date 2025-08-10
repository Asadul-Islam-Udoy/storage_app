import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/auth/token";

export async function middleware(req: NextRequest) {
  

  const accessToken = req.cookies.get("accessToken")?.value;

  const protectedPaths = ["/dashboard", "/videos", "/api/videos"];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!accessToken) {
    console.warn("Access token missing");
    return NextResponse.redirect(new URL("/pages/login?error=unauthorized", req.url));
  }

  try {
    await verifyAccessToken(accessToken); // Will throw if expired or invalid
    return NextResponse.next();
  } catch(err:any) {
    console.error("Token validation failed:", err.code || err.message);
    return NextResponse.redirect(new URL("/pages/login?error=unauthorized", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/videos/:path*", "/api/videos/:path*"],
};
