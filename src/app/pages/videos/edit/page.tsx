"use client";

import { useEffect, useState } from "react";

export default function VideoEditorAdvanced() {
  const [ffmpeg, setFfmpeg] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  // Filters array stores active filter strings
  const [filters, setFilters] = useState<string[]>([]);

  // Store multiple input files
  const [inputFiles, setInputFiles] = useState<File[]>([]);

  // Helper to fetch file data as Uint8Array
  const fetchFile = async (file: File): Promise<Uint8Array> => {
    return new Uint8Array(await file.arrayBuffer());
  };

  // Load ffmpeg on component mount
  useEffect(() => {
    const load = async () => {
      const ffmpegModule = await import("@ffmpeg/ffmpeg");
      const { FFmpeg }: any = ffmpegModule;
      const ffmpegInstance = new FFmpeg({ corePath: "...", log: true });
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
      setReady(true);
    };
    load();
  }, []);

  // Cleanup output URL on change
  useEffect(() => {
    return () => {
      if (outputVideo) URL.revokeObjectURL(outputVideo);
    };
  }, [outputVideo]);

  // Handle video file input
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

  // Cut video segment
  const cutVideo = async (startTime = 5, duration = 5) => {
    if (!ffmpeg || !fetchFile || inputFiles.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      await ffmpeg.writeFile("input0.mp4", await fetchFile(inputFiles[0]));

      await ffmpeg.exec([
        "-ss",
        `${startTime}`,
        "-t",
        `${duration}`,
        "-i",
        "input0.mp4",
        "-vf",
        "fps=30",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-preset",
        "fast",
        "-movflags",
        "faststart",
        "-strict",
        "experimental",
        "-y",
        "cut.mp4",
      ]);
      const data = await ffmpeg.readFile("cut.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        setOutputVideo(url);
      } else {
        setError("Output file is empty");
      }
    } catch (e) {
      setError("Cutting video failed");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  // Concatenate multiple videos
  const concatVideos = async () => {
    if (!ffmpeg || !fetchFile || inputFiles.length < 2) {
      setError("Need at least 2 videos to concatenate");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
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

      const listFileContent = inputFiles
        .map((_, i) => `file 'encoded${i}.mp4'`)
        .join("\n");
      await ffmpeg.writeFile(
        "list.txt",
        new TextEncoder().encode(listFileContent)
      );

      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "list.txt",
        "-c",
        "copy",
        "concat.mp4",
      ]);

      const data = await ffmpeg.readFile("concat.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        setOutputVideo(url);
      } else {
        setError("Output file is empty");
      }
    } catch (e) {
      console.error("Concatenation failed", e);
      setError("Concatenation failed");
    } finally {
      setProcessing(false);
    }
  };

  // Apply selected filters dynamically
  const applyFilters = async () => {
    if (!ffmpeg || !fetchFile || inputFiles.length === 0) return;
    if (filters.length === 0) {
      setError("Please select at least one filter.");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      await ffmpeg.writeFile("input0.mp4", await fetchFile(inputFiles[0]));

      // Compose final filter chain with scale + fps + selected filters
      const finalFilterChain = ["scale=1280:720", "fps=30", ...filters].join(
        ","
      );

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
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        setOutputVideo(url);
      } else {
        setError("Output file is empty");
      }
    } catch (e) {
      console.error(e);
      setError("Dynamic filtering failed");
    } finally {
      setProcessing(false);
    }
  };

  // Convert video to Full HD 1920x1080 with H.264 video and AAC audio
  const convertToFullHD = async () => {
    if (!ffmpeg || inputFiles.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      // Write the input file to ffmpeg FS (use first file only)
      await ffmpeg.writeFile("input.mp4", await fetchFile(inputFiles[0]));

      // Run ffmpeg command to convert to 1920x1080, re-encode video and audio
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vf",
        "scale=1920:1080", // Resize video to full HD
        "-c:v",
        "libx264", // Video codec: H.264
        "-preset",
        "fast", // Encoding speed preset
        "-crf",
        "23", // Quality level (lower = better quality)
        "-c:a",
        "aac", // Audio codec: AAC
        "-b:a",
        "192k", // Audio bitrate
        "-movflags",
        "faststart", // Enable progressive streaming
        "-y", // Overwrite output file if exists
        "output.mp4",
      ]);

      // Read output video file from ffmpeg FS
      const data = await ffmpeg.readFile("output.mp4");

      if (data.length > 0) {
        // Create URL from Uint8Array for video playback
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
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

  ///add background audio
  const addBackgroundMusic = async () => {
    if (!ffmpeg || !fetchFile || inputFiles.length === 0 || !audioFile) {
      setError("Please select both a video and an audio file.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      await ffmpeg.writeFile("video.mp4", await fetchFile(inputFiles[0]));
      await ffmpeg.writeFile("music.mp3", await fetchFile(audioFile));

      // Mix audio: original audio + background music at lower volume
      await ffmpeg.exec([
        "-i",
        "video.mp4",
        "-i",
        "music.mp3",
        "-filter_complex",
        "[1:0]volume=0.5[aud];[0:a][aud]amix=inputs=2:duration=first:dropout_transition=2",
        "-c:v",
        "copy",
        "-shortest",
        "-y",
        "video_with_music.mp4",
      ]);

      const data = await ffmpeg.readFile("video_with_music.mp4");
      if (data.length > 0) {
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        setOutputVideo(url);
      } else {
        setError("Output file is empty.");
      }
    } catch (err) {
      console.error(err);
      setError("Adding background music failed.");
    } finally {
      setProcessing(false);
    }
  };

  // Initialize endTime to videoDuration on load
  useEffect(() => {
    if (videoDuration !== null) setEndTime(Math.floor(videoDuration));
  }, [videoDuration]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Advanced Video Editor</h1>

      {/* Hidden video to get duration */}
      {inputFiles[0] && (
        <video
          src={URL.createObjectURL(inputFiles[0])}
          onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
          style={{ display: "none" }}
        />
      )}
      <label>Video</label>
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
        disabled={processing}
        className="mb-4 p-2 bg-gray-800 rounded border border-gray-600 cursor-pointer"
      />
      <label>Audio</label>
      {/* Audio input */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        disabled={processing}
        className="mb-4 p-2 bg-gray-800 rounded border border-gray-600 cursor-pointer"
      />

      {/* Time selection sliders */}
      {videoDuration && (
        <div className="mb-4 w-full max-w-lg">
          <label className="block text-sm mb-1">Start Time: {startTime}s</label>
          <input
            type="range"
            min={0}
            max={videoDuration - 1}
            step={1}
            value={startTime}
            onChange={(e) => {
              const newStart = Number(e.target.value);
              setStartTime(newStart);
              if (newStart >= endTime) {
                setEndTime(
                  newStart + 1 <= videoDuration ? newStart + 1 : videoDuration
                );
              }
            }}
            className="w-full"
          />

          <label className="block text-sm mt-2 mb-1">
            End Time: {endTime - startTime}s
          </label>
          <input
            type="range"
            min={startTime + 1}
            max={videoDuration}
            step={1}
            value={endTime}
            style={{ direction: "rtl" }}
            onChange={(e) => {
              const endVal = Number(e.target.value);
              if (endVal > startTime) setEndTime(endVal);
            }}
            className="w-full"
          />
        </div>
      )}

      {inputFiles.length > 0 && (
        <p className="mb-4 text-green-400">
          {inputFiles.length} file{inputFiles.length > 1 ? "s" : ""} loaded.
        </p>
      )}

      {/* Error message */}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Action buttons */}
      <div className="space-x-4 mb-6">
        <button
          onClick={() => cutVideo(startTime, endTime - startTime)}
          disabled={processing || inputFiles.length === 0}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          Cut Video ({startTime}s → {endTime - startTime}s)
        </button>
        <button
          onClick={concatVideos}
          disabled={processing || inputFiles.length < 2}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Concatenate Videos
        </button>
        <button
          onClick={applyFilters}
          disabled={
            processing || inputFiles.length === 0 || filters.length === 0
          }
          className="px-4  py-2 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
        >
          Apply Filters
        </button>

        <button
          onClick={convertToFullHD}
          disabled={!ready || processing || inputFiles.length === 0}
          className="px-4 mt-4 md:mt-0 py-2 rounded bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
        >
          Convert to Full HD
        </button>

        <button
          onClick={addBackgroundMusic}
          disabled={
            processing || !ready || inputFiles.length === 0 || !audioFile
          }
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 mb-4"
        >
          Add Background Music
        </button>
      </div>

      {/* Filters selection */}
      <div className="mb-6 space-y-2 text-sm max-w-lg w-full">
        <label className="block font-semibold mb-2">Video Filters</label>

        <div className="flex flex-wrap gap-4">
          {/* Grayscale */}
          <label className="cursor-pointer select-none flex items-center space-x-2">
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
            />
            <span>Grayscale</span>
          </label>

          {/* Enhance Colors (only one eq=... filter allowed) */}
          <label className="cursor-pointer select-none flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.includes(
                "eq=brightness=0.05:contrast=1.3:saturation=1.2"
              )}
              onChange={(e) => {
                setFilters((prev) => {
                  // Remove any existing eq= filter first
                  const filtered = prev.filter((f) => !f.startsWith("eq="));
                  if (e.target.checked) {
                    return [
                      ...filtered,
                      "eq=brightness=0.05:contrast=1.3:saturation=1.2",
                    ];
                  }
                  return filtered;
                });
              }}
            />
            <span>Enhance Colors</span>
          </label>

          {/* Vertical Flip */}
          <label className="cursor-pointer select-none flex items-center space-x-2">
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
            />
            <span>Vertical Flip</span>
          </label>
          
        </div>
      </div>

      {/* Processed video output */}
      {processing && <p className="mb-4 text-indigo-400">Processing...</p>}

      {outputVideo && (
        <video
          src={outputVideo}
          controls
          width={480}
          onError={(e) => {
            console.error("Video playback error", e);
            alert("Video playback error! Check console.");
          }}
          className="rounded shadow-lg max-w-full"
        />
      )}
    </div>
  );
}
