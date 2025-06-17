
import { createCookie } from '@/lib/auth/cookies';
import { GenerateToken } from '@/lib/auth/token';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validators';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const tokens = GenerateToken({ id: user?.id, email: user.email });

  const response = NextResponse.json({ message: "Login successful" });
  response.headers.set('Set-Cookie', [
    createCookie('accessToken', tokens.accessToken, 60 * 15),
    createCookie('refreshToken', tokens.refreshToken, 60 * 60 * 24 * 7),
  ].join(', ')); // Join multiple cookies correctly

  return response;
}