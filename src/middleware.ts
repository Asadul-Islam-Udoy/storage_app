import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/auth/token";

export  function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);

  const accessToken = req.cookies.get("accessToken")?.value;
  console.log("token:", accessToken);

  const protectedPaths = ["/dashboard", "/videos", "/api/videos"];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!accessToken) {
     console.log('not access token')
    return NextResponse.redirect(new URL("/pages/login?error=unauthorized", req.url));
  }

  try {
    verifyAccessToken(accessToken);
    return NextResponse.next();
  } catch(err:any) {
    console.log('not access ss token',err)
    return NextResponse.redirect(new URL("/pages/login?error=unauthorized", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/videos/:path*", "/api/videos/:path*"],
};
