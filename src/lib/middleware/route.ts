import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/token";

export async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return null;
  try {
    const user = verifyAccessToken(token); // now typed
    return user; // contains .id, .email, etc.
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
