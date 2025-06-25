import { getAuthUser } from "@/lib/middleware/route";
import { prisma } from "@/lib/prisma";
import { updateVideoSchema } from "@/lib/validators";
import { mkdir, writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

interface Video {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  userId: number;
  createdAt: string;
}

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
  { params }: { params: { id: string | number } }
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
    const videoShow = {
      id: video.id,
      title: video.title,
      description: video.description,
      video_url: `/videos/${video.video}`,
      userId: video.userId,
      createdAt: video.createdAt,
    };
    return NextResponse.json({
      success: true,
      message: "video getting successfully!",
      video: videoShow,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

///delete video
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string | number } }
) {
  try {
    const videoId = Number(params.id);
    const video = await prisma.videos.findUnique({
      where: { id: videoId },
    });
    if (!video) {
      return NextResponse.json(
        { success: false, message: "video delete fails!" },
        { status: 400 }
      );
    }
    await prisma.videos.delete({ where: { id: videoId } });
    // Delete associated video file
    if (video?.video) {
      const uploadDir = path.join(process.cwd(), "public", "videos");
      const videoPath = path.join(uploadDir, video.video);

      // Use try-catch to avoid crashing if file doesn't exist
      try {
        await unlink(videoPath);
      } catch (err) {
        console.warn("File not found or already deleted:", videoPath);
      }
    }
    const videos = await prisma.videos.findMany();
    const normalizedVideos: Video[] = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      video_url: `/videos/${video.video}`,
      userId: video.userId,
      createdAt: video.createdAt?.toISOString() || "",
    }));
    return NextResponse.json(
      {
        success: true,
        message: "video delete successfully",
        videos: normalizedVideos,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error", error },
      { status: 500 }
    );
  }
}
