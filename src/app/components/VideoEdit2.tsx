"use client";

import { useEffect, useState } from "react";
import VideoSaveModal from "../modal/VideoSaveModal";

export default function VideoEdit2() {
  // States
  const [videoShow, setVideoShow] = useState(false);
  const [ffmpeg, setFfmpeg] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoRanges, setVideoRanges] = useState<[number, number][]>([[0, 5]]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [inputFiles, setInputFiles] = useState<File[]>([]);

  // Fetch file as Uint8Array for ffmpeg FS
  const fetchFile = async (file: File): Promise<Uint8Array> => {
    return new Uint8Array(await file.arrayBuffer());
  };

  // Load ffmpeg on component mount
  useEffect(() => {
    const load = async () => {
      const ffmpegModule = await import("@ffmpeg/ffmpeg");
      const { FFmpeg }: any = ffmpegModule;
      const ffmpegInstance = new FFmpeg({
        corePath: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/ffmpeg-core.js",
        log: true,
      });
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
      setReady(true);
    };
    load();
  }, []);

  // Cleanup output URL when outputVideo changes or unmount
  useEffect(() => {
    return () => {
      if (outputVideo) URL.revokeObjectURL(outputVideo);
    };
  }, [outputVideo]);

  // Initialize cut ranges on videoDuration load
  useEffect(() => {
    if (videoDuration !== null) setVideoRanges([[0, Math.floor(videoDuration)]]);
  }, [videoDuration]);

  // Handle video files input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setInputFiles((prev) => [...prev, ...files]);
      setOutputVideo(null);
    }
  };

  // Handle audio file input
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setOutputVideo(null);
    }
  };

  // --- VIDEO PROCESSING FUNCTIONS ---

  // 1. Cut and concatenate selected ranges from first video
  const cutAndConcatVideo = async () => {
    if (!ffmpeg || inputFiles.length === 0 || videoRanges.length === 0) {
      setError("No video or no ranges selected.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      await ffmpeg.writeFile("input.mp4", await fetchFile(inputFiles[0]));
      const segmentFiles: string[] = [];
      for (let i = 0; i < videoRanges.length; i++) {
        const [start, end] = videoRanges[i];
        const output = `cut_${i}.mp4`;
        await ffmpeg.exec([
          "-ss",
          `${start}`,
          "-to",
          `${end}`,
          "-i",
          "input.mp4",
          "-c",
          "copy",
          "-y",
          output,
        ]);
        segmentFiles.push(output);
      }
      const concatList = segmentFiles.map((f) => `file '${f}'`).join("\n");
      await ffmpeg.writeFile("concat_list.txt", new TextEncoder().encode(concatList));
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "concat_list.txt",
        "-c",
        "copy",
        "-y",
        "final_output.mp4",
      ]);
      const data = await ffmpeg.readFile("final_output.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        setOutputVideo(url);
      } else {
        setError("Output file is empty.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to cut & concatenate.");
    } finally {
      setProcessing(false);
    }
  };

  // 2. Concatenate multiple videos
  const concatVideos = async () => {
    if (!ffmpeg || inputFiles.length < 2) {
      setError("Need at least 2 videos to concatenate.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      // Encode each video to standard format and resolution
      for (let i = 0; i < inputFiles.length; i++) {
        const fileData = await fetchFile(inputFiles[i]);
        await ffmpeg.writeFile(`input${i}.mp4`, fileData);
        await ffmpeg.exec([
          "-i",
          `input${i}.mp4`,
          "-vf",
          "scale=1280:720",
          "-r",
          "30",
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-c:a",
          "aac",
          `encoded${i}.mp4`,
        ]);
      }
      // Create list file for concat
      const listFileContent = inputFiles.map((_, i) => `file 'encoded${i}.mp4'`).join("\n");
      await ffmpeg.writeFile("list.txt", new TextEncoder().encode(listFileContent));
      // Concat encoded videos
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "list.txt",
        "-c",
        "copy",
        "-y",
        "concat.mp4",
      ]);
      const data = await ffmpeg.readFile("concat.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        setOutputVideo(url);
      } else {
        setError("Output file is empty.");
      }
    } catch (err) {
      console.error(err);
      setError("Concatenation failed.");
    } finally {
      setProcessing(false);
    }
  };

  // 3. Apply selected video filters
  const applyFilters = async () => {
    if (!ffmpeg || inputFiles.length === 0) return;
    if (filters.length === 0) {
      setError("Please select at least one filter.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      await ffmpeg.writeFile("input0.mp4", await fetchFile(inputFiles[0]));
      const finalFilterChain = ["scale=1280:720", "fps=30", ...filters].join(",");
      await ffmpeg.exec([
        "-i",
        "input0.mp4",
        "-vf",
        finalFilterChain,
        "-c:a",
        "copy",
        "-y",
        "filtered.mp4",
      ]);
      const data = await ffmpeg.readFile("filtered.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        setOutputVideo(url);
      } else {
        setError("Output file is empty.");
      }
    } catch (e) {
      console.error(e);
      setError("Dynamic filtering failed.");
    } finally {
      setProcessing(false);
    }
  };

  // 4. Convert video to Full HD 1920x1080 with re-encoding
  const convertToFullHD = async () => {
    if (!ffmpeg || inputFiles.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      await ffmpeg.writeFile("input.mp4", await fetchFile(inputFiles[0]));
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vf",
        "scale=1920:1080",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "faststart",
        "-y",
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        setOutputVideo(url);
      } else {
        setError("Conversion failed: output file is empty.");
      }
    } catch (err) {
      setError("Conversion failed: " + (err as Error).message);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // 5. Add background music to the first video
  const addBackgroundMusic = async () => {
    if (!ffmpeg || inputFiles.length === 0 || !audioFile) {
      setError("Please select both a video and an audio file.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      await ffmpeg.writeFile("video.mp4", await fetchFile(inputFiles[0]));
      await ffmpeg.writeFile("music.mp3", await fetchFile(audioFile));
      await ffmpeg.exec([
        "-i",
        "video.mp4",
        "-i",
        "music.mp3",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:v",
        "copy",
        "-shortest",
        "-y",
        "video_with_music.mp4",
      ]);
      const data = await ffmpeg.readFile("video_with_music.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        setOutputVideo(url);
      } else {
        setError("Output file is empty.");
      }
    } catch (err: any) {
      console.error("Background music error", err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      setError("Adding background music failed: " + msg);
    } finally {
      setProcessing(false);
    }
  };

  // Download processed video
  const downloadVideo = () => {
    if (!outputVideo) return;
    const link = document.createElement("a");
    link.href = outputVideo;
    link.download = `edited_video_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-tr  from-gray-900 via-gray-800 to-gray-950 text-gray-100 p-6 sm:p-12 flex flex-col items-center font-sans select-none">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-8 text-center tracking-wide drop-shadow-lg">
        🎬 Advanced Video Editor
      </h1>

      {videoShow && outputVideo && (
        <VideoSaveModal videoFileName={outputVideo} videoShow={videoShow} setVideoShow={setVideoShow} />
      )}

      {/* Video Preview(s) */}
      <div className="w-full max-w-4xl flex flex-col gap-6 mb-8">
        {inputFiles.length === 1 && (
          <video
            src={URL.createObjectURL(inputFiles[0])}
            className="w-full rounded-xl shadow-2xl border-4 border-indigo-700"
            onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
            controls
          />
        )}

        {inputFiles.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inputFiles.map((file, i) => (
              <video
                key={i}
                src={URL.createObjectURL(file)}
                className="w-full rounded-xl shadow-lg border-2 border-indigo-600 object-contain"
                onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                controls
              />
            ))}
          </div>
        )}
      </div>

      {/* File Inputs */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div>
          <label className="block text-sm font-semibold mb-2">Select Video(s)</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileChange}
            disabled={processing}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Select Audio (optional)</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            disabled={processing}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-indigo-500 transition"
          />
        </div>
      </div>

        <section className="w-full max-w-4xl mb-10 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-indigo-400">Video Cut Ranges</h2>

          {videoRanges.map(([start, end], idx) => (
            <div
              key={idx}
              className="mb-6 p-4 bg-gray-700 rounded-lg shadow-inner"
            >
              <div className="flex justify-between items-center mb-2 text-sm text-gray-300">
                <span>
                  Range {idx + 1}: <strong>{start}s</strong> → <strong>{end}s</strong>
                </span>
                <button
                  onClick={() => {
                    const updated = videoRanges.filter((_, i) => i !== idx);
                    setVideoRanges(updated.length ? updated : [[0, videoDuration ?? 10]]);
                  }}
                  className="text-red-500 hover:text-red-600 font-bold px-2 rounded focus:outline-none"
                  aria-label={`Remove range ${idx + 1}`}
                >
                  ✕ Remove
                </button>
              </div>

              <div>
                <label htmlFor={`start-range-${idx}`} className="block text-xs text-gray-400 mb-1">
                  Start: {start}s
                </label>
                <input
                  id={`start-range-${idx}`}
                  type="range"
                  min={0}
                  max={videoDuration || 1000}
                  step={1}
                  value={start}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const updated = [...videoRanges];
                    updated[idx][0] = Math.min(val, updated[idx][1] - 1);
                    setVideoRanges(updated);
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="mt-3">
                <label htmlFor={`end-range-${idx}`} className="block text-xs text-gray-400 mb-1">
                  End: {end}s
                </label>
                <input
                  id={`end-range-${idx}`}
                  type="range"
                  min={0}
                  max={videoDuration || 0}
                  step={1}
                  value={end}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const updated = [...videoRanges];
                    updated[idx][1] = Math.max(val, updated[idx][0] + 1);
                    setVideoRanges(updated);
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          ))}

          <button
            onClick={() => setVideoRanges([...videoRanges, [0, Math.min(10, videoDuration ?? 10)]])}
            className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            + Add Range
          </button>
        </section>

      {/* Filters */}
      <section className="w-full max-w-4xl mb-10 bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-yellow-400">Video Filters</h2>
        <div className="flex flex-wrap gap-6 text-sm text-gray-200">
          {/* Grayscale */}
          <label className="cursor-pointer flex items-center gap-3 select-none">
            <input
              type="checkbox"
              checked={filters.includes("format=gray")}
              onChange={(e) => {
                setFilters((prev) =>
                  e.target.checked
                    ? [...prev, "format=gray"]
                    : prev.filter((f) => f !== "format=gray")
                );
              }}
              className="accent-yellow-400"
            />
            Grayscale
          </label>

          {/* Enhance Colors */}
          <label className="cursor-pointer flex items-center gap-3 select-none">
            <input
              type="checkbox"
              checked={filters.includes("eq=brightness=0.05:contrast=1.3:saturation=1.2")}
              onChange={(e) => {
                const filtered = filters.filter((f) => !f.startsWith("eq="));
                setFilters(
                  e.target.checked
                    ? [...filtered, "eq=brightness=0.05:contrast=1.3:saturation=1.2"]
                    : filtered
                );
              }}
              className="accent-yellow-400"
            />
            Enhance Colors
          </label>

          {/* Vertical Flip */}
          <label className="cursor-pointer flex items-center gap-3 select-none">
            <input
              type="checkbox"
              checked={filters.includes("vflip")}
              onChange={(e) => {
                setFilters((prev) =>
                  e.target.checked
                    ? [...prev, "vflip"]
                    : prev.filter((f) => f !== "vflip")
                );
              }}
              className="accent-yellow-400"
            />
            Vertical Flip
          </label>
        </div>
      </section>

      {/* Processing & Error Messages */}
      {processing && (
        <p className="text-indigo-400 text-center font-semibold text-lg mb-6 animate-pulse">
          🔄 Processing...
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center font-semibold mb-6 select-text break-words">
          ⚠ {error}
        </p>
      )}

      {/* Action Buttons */}
      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        <button
          onClick={cutAndConcatVideo}
          disabled={processing || inputFiles.length === 0 || inputFiles.length >= 2}
          className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Cut video by selected ranges and merge"
        >
          ✂️ Cut Video
        </button>

        <button
          onClick={concatVideos}
          disabled={processing || inputFiles.length < 2}
          className="py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Concatenate multiple videos into one"
        >
          🔗 Concatenate Videos
        </button>

        <button
          onClick={applyFilters}
          disabled={processing || inputFiles.length === 0 || filters.length === 0}
          className="py-3 px-6 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Apply selected filters to video"
        >
          🎨 Apply Filters
        </button>

        <button
          onClick={convertToFullHD}
          disabled={processing || !ready || inputFiles.length === 0}
          className="py-3 px-6 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Convert video to Full HD 1920x1080"
        >
          📺 Convert to Full HD
        </button>

        <button
          onClick={addBackgroundMusic}
          disabled={processing || !ready || inputFiles.length === 0 || !audioFile}
          className="py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-2"
          title="Add background music to video"
        >
          🎵 Add Background Music
        </button>
      </section>

      {/* Output Preview and Actions */}
      {outputVideo && (
        <section className="w-full max-w-4xl flex flex-col items-center gap-6 mb-16">
          <video
            src={outputVideo}
            controls
            className="w-full rounded-2xl shadow-2xl border-4 border-indigo-600"
            onError={(e) => {
              console.error("Video playback error", e);
              alert("Video playback error! Please check the console.");
            }}
          />

          <div className="flex gap-6">
            <button
              onClick={() => setVideoShow(true)}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              title="Open save modal"
            >
              💾 Save Video
            </button>

            <button
              onClick={downloadVideo}
              className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
              title="Download video file"
            >
              ⬇ Download Video
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
