"use client";
import { useEffect, useState } from "react";
export default function VideoEditor() {
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

  // Helper to fetch file data as Uint8Array
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

  // Cleanup output URL on change
  useEffect(() => {
    return () => {
      if (outputVideo) URL.revokeObjectURL(outputVideo);
    };
  }, [outputVideo]);

  // Initialize endTime to videoDuration on load
  useEffect(() => {
    if (videoDuration !== null)
      setVideoRanges([[0, Math.floor(videoDuration)]]);
  }, [videoDuration]);

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

  ///cutvideo with marge
  const cutAndConcatVideo = async () => {
    if (!ffmpeg || inputFiles.length === 0 || videoRanges.length === 0) {
      setError("No video or no ranges selected.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      // Write input video
      await ffmpeg.writeFile("input.mp4", await fetchFile(inputFiles[0]));
      const segmentFiles: string[] = [];
      // Cut each range into a segment file
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

      // Write list of segments
      const concatList = segmentFiles.map((f) => `file '${f}'`).join("\n");
      await ffmpeg.writeFile(
        "concat_list.txt",
        new TextEncoder().encode(concatList)
      );

      // Concatenate segments into final file
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
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
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

  ///add background audio
  const addBackgroundMusic = async () => {
    if (!ffmpeg || !fetchFile || inputFiles.length === 0 || !audioFile) {
      setError("Please select both a video and an audio file.");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      // Write both files to FS
      await ffmpeg.writeFile("video.mp4", await fetchFile(inputFiles[0]));
      await ffmpeg.writeFile("music.mp3", await fetchFile(audioFile));
      // Mix audio
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
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
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

  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Advanced Video Editor</h1>

      {/* Hidden video to get duration */}
      {inputFiles.length === 1 && (
        <video
          src={URL.createObjectURL(inputFiles[0])}
          width={480}
          onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
          controls
        />
      )}
      {inputFiles?.length > 1 && (
        <>
          {inputFiles?.map((item, index) => (
            <video
              className=" max-h-80"
              src={URL.createObjectURL(item)}
              width={480}
              onLoadedMetadata={(e) =>
                setVideoDuration(e.currentTarget.duration)
              }
              controls
            />
          ))}
        </>
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

      {/* video range */}
      {inputFiles?.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold block"> Video Cut Ranges</label>

          {videoRanges.map(([start, end], idx) => (
            <div key={idx} className="flex gap-1 my-2 p-2 bg-gray-800 rounded">
              <div className="flex justify-between text-sm text-gray-300">
                <span>
                  Range {idx + 1}: {start}s → {end}s
                </span>
                <button
                  onClick={() => {
                    const updated = videoRanges.filter((_, i) => i !== idx);
                    setVideoRanges(updated);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                >
                  ✕ Remove
                </button>
              </div>

              {/* Start Slider */}
              <label className="text-xs mt-1 text-gray-400">
                Start: {start}s
              </label>
              <input
                type="range"
                min={0}
                max={videoDuration || 1000}
                step={1}
                value={start}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = [...videoRanges];
                  updated[idx][0] = Math.min(val, updated[idx][1] - 1); // prevent start >= end
                  setVideoRanges(updated);
                }}
              />

              {/* End Slider */}
              <label className="text-xs mt-1 text-gray-400">End: {end}s</label>
              <input
                type="range"
                min={0}
                max={videoDuration || 0}
                step={1}
                value={end}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = [...videoRanges];
                  updated[idx][1] = Math.max(val, updated[idx][0] + 1); // prevent end <= start
                  setVideoRanges(updated);
                }}
              />
            </div>
          ))}

          <button
            onClick={() => setVideoRanges([...videoRanges, [0, 10]])}
            className="mt-2 px-3 py-1 bg-green-600 rounded"
          >
            + Add Range
          </button>
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
          onClick={cutAndConcatVideo}
          disabled={processing || inputFiles.length === 0}
          className="px-4 py-2 cursor-pointer rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          Cut Video
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
          className="px-4 py-2 mt-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 mb-4"
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
