"use client";

import { useEffect, useState } from "react";

export default function VideoEditorAdvanced() {
  const [ffmpeg, setFfmpeg] = useState<any>(null);
  //const [fetchFile, setFetchFile] = useState<any>(null); // Store fetchFile here
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  // Store multiple input files
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  // Your own fetchFile helper
  const fetchFile = async (file: File): Promise<Uint8Array> => {
    return new Uint8Array(await file.arrayBuffer());
  };
  useEffect(() => {
    const load = async () => {
      const ffmpegModule = await import("@ffmpeg/ffmpeg");
      const { FFmpeg } = ffmpegModule;
      const ffmpegInstance = new FFmpeg({ corePath: "...", log: true });
      console.log(ffmpegInstance);
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance); // Save fetchFile in state
      setReady(true);
    };
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (outputVideo) {
        URL.revokeObjectURL(outputVideo);
      }
    };
  }, [outputVideo]);

  // Add files to inputFiles array
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setInputFiles((prev) => [...prev, ...files]);
      setOutputVideo(null);
    }
  };

  // 1. Cut video segment from first input (e.g. from 00:00:05 to 00:00:10)
  const cutVideo = async (startTime = 5, duration = 5) => {
    if (!ffmpeg || !fetchFile || inputFiles.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      await ffmpeg.writeFile("input0.mp4", await fetchFile(inputFiles[0]));

      await ffmpeg.exec([
        "-ss",
        `${startTime}`, // Start time
        "-t",
        `${duration}`, // Duration
        "-i",
        "input0.mp4", // Input file
        "-vf",
        "fps=30", // Optional: framerate control
        "-c:v",
        "libx264", // Video codec
        "-c:a",
        "aac", // Audio codec
        "-preset",
        "fast", // Encoding speed
        "-movflags",
        "faststart", // Enable progressive streaming
        "-strict",
        "experimental", // Allow experimental codecs (if needed)
        "-y", // Overwrite output file
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
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setOutputVideo(url);
    } catch (e) {
      setError("Cutting video failed");
      console.log(e);
    } finally {
      setProcessing(false);
    }
  };

  // 2. Concatenate multiple input videos
  const concatVideos = async () => {
    if (!ffmpeg || !fetchFile || inputFiles.length < 2) {
      setError("Need at least 2 videos to concatenate");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      for (let i = 0; i < inputFiles.length; i++) {
        await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(inputFiles[i]));
      }

      const listFileContent = inputFiles
        .map((_, i) => `file 'input${i}.mp4'`)
        .join("\n");

      ffmpeg.writeFile("list.txt", new TextEncoder().encode(listFileContent));

      await ffmpeg.run(
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "list.txt",
        "-c",
        "copy",
        "concat.mp4"
      );

      const data = ffmpeg.readFile("concat.mp4");
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setOutputVideo(url);
    } catch (e) {
      setError("Concatenation failed");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  // 3. Apply grayscale filter to first input video
  const applyGrayscale = async () => {
    if (!ffmpeg || !fetchFile || inputFiles.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      await ffmpeg.writeFile("input0.mp4", await fetchFile(inputFiles[0]));

      await ffmpeg.run(
        "-i",
        "input0.mp4",
        "-vf",
        "format=gray",
        "-c:a",
        "copy",
        "gray.mp4"
      );

      const data = ffmpeg.readFile("gray.mp4");
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setOutputVideo(url);
    } catch (e) {
      setError("Applying grayscale filter failed");
      console.log(e);
    } finally {
      setProcessing(false);
    }
  };

  console.log("output url", videoDuration,endTime);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Advanced Video Editor</h1>
      {inputFiles[0] && (
        <video
          src={URL.createObjectURL(inputFiles[0])}
          onLoadedMetadata={(e) => {
            const duration = e.currentTarget.duration;
            setVideoDuration(duration); // default to first 5s
          }}
          style={{ display: "none" }}
        />
      )}
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
        disabled={processing}
        className="mb-4 p-2 bg-gray-800 rounded border border-gray-600 cursor-pointer"
      />
      {videoDuration && (
        <div className="mb-4">
          <label className="block text-sm mb-1">Start Time: {startTime}s</label>
          <input
            type="range"
            min="0"
            max={videoDuration - 1}
            step="1"
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
          />
          <label className="block text-sm mt-2 mb-1">
            End Time: {endTime}s
          </label>
          <input
            type="range"
            min={startTime + 1}
            max={videoDuration}
            step="1"
            value={endTime}
            onChange={(e) => setEndTime(Number(e.target.value))}
          />
        </div>
      )}
      {inputFiles.length > 0 && (
        <p className="mb-4 text-green-400">
          {inputFiles.length} file{inputFiles.length > 1 ? "s" : ""} loaded.
        </p>
      )}

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="space-x-4 mb-6">
        <button
          onClick={() => cutVideo(2, 10)}
          disabled={processing || inputFiles.length === 0}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          Cut Video ({startTime}s → {endTime}s)
        </button>
        <button
          onClick={concatVideos}
          disabled={processing || inputFiles.length < 2}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Concatenate Videos
        </button>
        <button
          onClick={applyGrayscale}
          disabled={processing || inputFiles.length === 0}
          className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
        >
          Grayscale Filter
        </button>
      </div>

      {processing && <p className="mb-4 text-indigo-400">Processing...</p>}

      {outputVideo && (
        <video
          src={outputVideo}
          controls
          width={480}
          onError={(e) => {
            console.log("Video playback error", e);
            alert("Video playback error! See console.");
          }}
          className="rounded shadow-lg max-w-full"
        />
      )}
    </div>
  );
}
