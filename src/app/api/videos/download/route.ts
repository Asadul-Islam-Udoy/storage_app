import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: "No video URL provided" },
        { status: 400 }
      );
    }

    const videosDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    const outputFile = path.join(videosDir, `${Date.now()}.mp4`);

    const ytDlpPath =
      "C:\\Users\\mdasa\\AppData\\Local\\Programs\\Python\\Python313\\Scripts\\yt-dlp.exe";

    if (!fs.existsSync(ytDlpPath)) {
      throw new Error(`yt-dlp executable not found at ${ytDlpPath}`);
    }

    const args = [
      videoUrl,
      "-o",
      outputFile,
      "-f",
      "bestvideo+bestaudio",
      "--merge-output-format",
      "mp4",
    ];

    await execFileAsync(ytDlpPath, args);

    return NextResponse.json({
      success: true,
      url: `/videos/${path.basename(outputFile)}`,
    });
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Download failed" },
      { status: 500 }
    );
  }
}
