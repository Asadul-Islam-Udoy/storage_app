import { prisma } from "@/lib/prisma";
import { createPicturesSchema } from "@/lib/validators"; // create this schema similar to createVideoSchema
import { mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/middleware/route";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") || "";
    const pictureUrl = formData.get("pictureUrl") as string | null;
    const userId = Number(user.id);
    const picture = formData.get("picture") as File | null;

    // 3. Validate presence of picture or URL
    if (!(picture instanceof File) && !pictureUrl) {
      return NextResponse.json(
        { success: false, message: "Picture file or picture URL is required" },
        { status: 400 }
      );
    }

    // 4. Validate data with schema (you need to create this Zod schema)
    const parsed = createPicturesSchema.safeParse({
      title,
      description,
      userId,
      picture: picture instanceof File ? picture.name : undefined,
      pictureUrl: typeof pictureUrl === "string" ? pictureUrl : undefined,
    });

    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten();
      const firstFormError = formErrors[0];
      const firstFieldError = Object.values(fieldErrors)[0]?.[0];
      return NextResponse.json(
        { success: false, message: firstFormError || firstFieldError || "Validation failed" },
        { status: 400 }
      );
    }

    // 5. Handle file upload
    let fileName = "";
    if (picture && picture.name) {
      // Prepare upload directory
      const uploadDir = path.join(process.cwd(), "public", "pictures");
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const safeFileName = picture.name.replace(/\s+/g, "-");
      fileName = `${timestamp}-${safeFileName}`;
      const filePath = path.join(uploadDir, fileName);

      // Stream file to disk
      const nodeReadable = Readable.fromWeb(picture.stream() as any);
      const writeStream = fs.createWriteStream(filePath);
      await pipeline(nodeReadable, writeStream);
    }

    // 6. Save picture metadata in database
    const pictureCreate = await prisma.pictures.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || "",
        picture: fileName || '',
        pictureUrl: parsed.data.pictureUrl || "",
        userId: parsed.data.userId,
      },
    });

    if (!pictureCreate) {
      return NextResponse.json({ success: false, message: "Picture creation failed" }, { status: 400 });
    }

    // 7. Prepare return data
    const pictureShow = {
      id: pictureCreate.id,
      title: pictureCreate.title,
      description: pictureCreate.description,
      picture: fileName || '',
      pictureUrl:parsed.data.pictureUrl || '',
      userId: pictureCreate.userId,
      createdAt: pictureCreate.createdAt,
    };

    // 8. Return success response
    return NextResponse.json(
      { success: true, message: "Picture uploaded successfully", picture: pictureShow },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message || error },
      { status: 500 }
    );
  }
}
