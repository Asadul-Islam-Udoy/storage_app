import { prisma } from "@/lib/prisma";
import { createVideoSchema } from "@/lib/validators";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getAuthUser } from "../../../lib/middleware/route";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const userId = formData.get("userId");
    const video = formData.get("video");

    if (!(video instanceof File)) {
      return NextResponse.json(
        { message: "Video file is required" },
        { status: 400 }
      );
    }
    const persed = createVideoSchema.safeParse({
      title,
      description,
      userId,
      video,
    });
    if (!persed.success) {
      return NextResponse.json(
        { message: persed.error.flatten() },
        { status: 400 }
      );
    }
    const videoBuffer = Buffer.from(await video.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "videos");
    await mkdir(uploadDir, { recursive: true });
    const timestamp = Date.now();
    const safeFileName = video.name.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${safeFileName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, videoBuffer);

    const videoCreate = await prisma.videos.create({
      data: {
        title: persed.data.title,
        description: persed.data.description,
        video: persed.data.video,
        userId: persed.data.userId,
      },
    });

    if (!videoCreate) {
      return NextResponse.json(
        { message: "video create fail" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "video create successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error!" },
      { status: 500 }
    );
  }
}
