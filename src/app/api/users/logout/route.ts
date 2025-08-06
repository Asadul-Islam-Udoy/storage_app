import { NextResponse } from "next/server";

export async function POST() {
  // Clear cookies by setting them to expired
  const response = NextResponse.json({ message: "Logout successful" });

  response.headers.append(
    "Set-Cookie",
    "accessToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
  );

  response.headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
  );

  return response;
}
