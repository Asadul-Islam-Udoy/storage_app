import { getAuthUser } from "@/lib/middleware/route";
import { prisma } from "@/lib/prisma";
import { updateVideoSchema } from "@/lib/validators";
import { mkdir, writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

///update video
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const videoId = Number(params.id);

    const formData = new FormData();
    const title = formData.get("title");
    const description = formData.get("description");
    const userId = formData.get("userId");
    const videoFile = formData.get("video");
    const existing = await prisma.videos.findUnique({ where: { id: videoId } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "video is not found" },
        { status: 404 }
      );
    }
    let newVideoFile = existing.video;

    if (videoFile instanceof File) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      const safeName = videoFile.name.replace(/\s+/g, "-");
      newVideoFile = `${Date.now()}-${safeName}`;

      const uploadDir = path.join(process.cwd(), "public", "videos");
      await mkdir(uploadDir, { recursive: true });

      await writeFile(path.join(uploadDir, newVideoFile), buffer);

      const oldPath = path.join(uploadDir, existing.video);
      await unlink(oldPath).catch(() => {});
    }

    const persed = updateVideoSchema.safeParse({
      title,
      description,
      userId: Number(userId),
      video: newVideoFile,
    });

    if (!persed.success) {
      const { fieldErrors, formErrors } = persed.error.flatten();
      const firstFromError = formErrors[0];
      const firsFiledError = Object.values(fieldErrors)[0]?.[0];
      return NextResponse.json(
        {
          success: false,
          message: firsFiledError || firstFromError || "validation failed",
        },
        { status: 401 }
      );
    }

    const updated = await prisma.videos.update({
      where: { id: videoId },
      data: {
        title: persed.data.title,
        description: persed.data.description,
        video: persed.data.video,
        userId: persed.data.userId,
      },
    });
    return NextResponse.json(
      { message: "video updated successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

///get single video

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = Number(params.id);
    const video = await prisma.videos.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json(
        { success: false, message: "video not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "video getting successfully!",
      video,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
