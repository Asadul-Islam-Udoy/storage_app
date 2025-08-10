import { prisma } from "@/lib/prisma";
import { updatePictureSchema } from "@/lib/validators"; // Define this schema for update validation
import { mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/middleware/route";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export async function PATCH(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const idStr = formData.get("id");
    if (!idStr || typeof idStr !== "string") {
      return NextResponse.json({ success: false, message: "Picture ID is required" }, { status: 400 });
    }
    const id = Number(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid Picture ID" }, { status: 400 });
    }

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const pictureUrl = formData.get("pictureUrl") as string | null;
    const picture = formData.get("picture") as File | null;

    // 3. Validate update data - you can accept partial updates, so fields optional
    const parsed = updatePictureSchema.safeParse({
      id,
      title,
      description,
      picture: picture instanceof File ? picture.name : undefined,
      pictureUrl: typeof pictureUrl === "string" ? pictureUrl : undefined,
      userId: Number(user.id),
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

    // 4. Fetch existing picture record
    const existingPicture = await prisma.pictures.findUnique({ where: { id } });
    if (!existingPicture) {
      return NextResponse.json({ success: false, message: "Picture not found" }, { status: 404 });
    }

    // 5. Optional: Check ownership (only allow updating your own pictures)
    if (existingPicture.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // 6. Handle new picture file upload if present
    let fileName = existingPicture.picture; // keep old filename if no new file uploaded
    if (picture && picture.name) {
      const uploadDir = path.join(process.cwd(), "public", "pictures");
      await mkdir(uploadDir, { recursive: true });

      const timestamp = Date.now();
      const safeFileName = picture.name.replace(/\s+/g, "-");
      fileName = `${timestamp}-${safeFileName}`;
      const filePath = path.join(uploadDir, fileName);

      const nodeReadable = Readable.fromWeb(picture.stream() as any);
      const writeStream = fs.createWriteStream(filePath);
      await pipeline(nodeReadable, writeStream);

      // Optional: delete old file from disk if you want to clean up
      if (existingPicture.picture) {
        const oldFilePath = path.join(uploadDir, existingPicture.picture);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.warn("Failed to delete old picture file:", err);
        });
      }
    }

    // 7. Update DB record
    const updatedPicture = await prisma.pictures.update({
      where: { id },
      data: {
        title: parsed.data.title ?? existingPicture.title,
        description: parsed.data.description ?? existingPicture.description,
        picture: fileName,
        pictureUrl: parsed.data.pictureUrl ?? existingPicture.pictureUrl,
      },
    });

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Picture updated successfully",
        picture: updatedPicture,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message || error },
      { status: 500 }
    );
  }
}
