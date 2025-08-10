import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const exists = await prisma.users.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: 'Email already used' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({ data: { name, email, password: hashedPassword,permission:{
      create:{
        roles:[Role.USER]
      }
    } },include:{
      permission:true
    } });

    return NextResponse.json({ user: { id: user.id, name, email } }, { status: 201 });

  } catch (err:any) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
