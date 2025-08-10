import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware/route";
import { mkdir } from "fs/promises";
import { Readable } from "stream";
import { createOthersFileSchema } from "@/lib/validators";

export const config = {
  api: {
    bodyParser: false, // important to disable Next.js body parsing for file upload
  },
};

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse formData from request
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = (formData.get("description") as string) || "";
    const fileUrl = formData.get("fileUrl") as string | null;
    const file = formData.get("file") as File | null; // input name="file"
    const userId = Number(user.id)
    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    if (!file && !fileUrl) {
      return NextResponse.json(
        { message: "Please upload a file or provide a file URL" },
        { status: 400 }
      );
    }
    // 3. Validate form fields
    const parsed = createOthersFileSchema.safeParse({
      title,
      description,
      userId: Number(userId),
      file: file instanceof File ? file.name : undefined,
      fileUrl: typeof fileUrl === "string" ? fileUrl : undefined,
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

    let savedFilePath: string | null = null;

    // 3. If file uploaded, save it
    if (file) {
      const uploadDir = path.join(process.cwd(), "public", "pdfs");
      await mkdir(uploadDir, { recursive: true });

      // Make safe filename
      const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeFileName);

      // Convert Web ReadableStream to Node.js Readable
      const readableStream = Readable.from(file.stream() as any);
      const writableStream = fs.createWriteStream(filePath);

      await new Promise<void>((resolve, reject) => {
        readableStream
          .pipe(writableStream)
          .on("finish", () => resolve())
          .on("error", (err) => reject(err));
      });

      savedFilePath = `pdfs/${safeFileName}`;
    }

    // 4. Save record to DB
    const record = await prisma.others_File.create({
      data: {
        title,
        description,
        file: savedFilePath,
        fileUrl: fileUrl || null,
        userId: userId,
      },
    });

    // 5. Return response
    return NextResponse.json({
      message: "Upload successful",
      data: record,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
