import { prisma } from "@/lib/prisma";
import { createVideoSchema } from "@/lib/validators";
import { mkdir } from "fs/promises";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getAuthUser } from "../../../lib/middleware/route";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const userId = formData.get("userId");
    const video = formData.get("video");

    if (!(video instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Video file is required" },
        { status: 400 }
      );
    }

    // 3. Validate form fields
    const parsed = createVideoSchema.safeParse({
      title,
      description,
      userId: Number(userId),
      video: video.name,
    });

    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten();
      const firstFormError = formErrors[0];
      const firstFieldError = Object.values(fieldErrors)[0]?.[0];
      return NextResponse.json(
        {
          success: false,
          message: firstFormError || firstFieldError || "Validation failed",
        },
        { status: 400 }
      );
    }

    // 4. Prepare upload directory
    const uploadDir = path.join(process.cwd(), "public", "videos");
    await mkdir(uploadDir, { recursive: true });

    // 5. Create safe filename and file path
    const timestamp = Date.now();
    const safeFileName = video.name.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${safeFileName}`;
    const filePath = path.join(uploadDir, fileName);

    // 6. Stream video file to disk
    const nodeReadable = Readable.fromWeb(video.stream() as any);
    const writeStream = fs.createWriteStream(filePath);

    // Use pipeline to handle streaming with backpressure & errors
    await pipeline(nodeReadable, writeStream);

    // 7. Save video info in database
    const videoCreate = await prisma.videos.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        video: fileName,
        userId: parsed.data.userId,
      },
    });

    // 8. Prepare data to return
    const videoShow = {
      id: videoCreate.id,
      title: videoCreate.title,
      description: videoCreate.description,
      video_url: `/videos/${videoCreate.video}`,
      userId: videoCreate.userId,
      createdAt: videoCreate.createdAt,
    };

    if (!videoCreate) {
      return NextResponse.json(
        { success: false, message: "Video creation failed" },
        { status: 400 }
      );
    }

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Video created successfully",
        video: videoShow,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error!", error: error.message || error },
      { status: 500 }
    );
  }
}
