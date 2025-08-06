"use client";

import { useEffect, useState } from "react";

export default function AudioEditor() {
  const [ffmpeg, setFfmpeg] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputAudio, setOutputAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioRanges, setAudioRanges] = useState<[number, number][]>([[0, 5]]);
  const [audioFile, setAudioFile] = useState<File | null>(null);

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

  // Cleanup output URL when output changes or component unmounts
  useEffect(() => {
    return () => {
      if (outputAudio) {
        URL.revokeObjectURL(outputAudio);
      }
    };
  }, [outputAudio]);

  // Initialize endTime to audioDuration on load
  useEffect(() => {
    if (audioDuration !== null) {
      setAudioRanges([[0, Math.floor(audioDuration)]]);
    }
  }, [audioDuration]);

  // Handle audio file input
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setOutputAudio(null);
      setAudioDuration(null);
      setAudioRanges([[0, 5]]);
    }
  };

  // Cut and concatenate audio ranges
  const cutAndConcatAudio = async () => {
    if (!ffmpeg || !audioFile || audioRanges.length === 0) {
      setError("No audio file or no ranges selected.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Write audio file to ffmpeg FS
      await ffmpeg.writeFile("input_audio.mp3", await fetchFile(audioFile));

      const segmentFiles: string[] = [];

      // Cut each selected range into a separate segment file
      for (let i = 0; i < audioRanges.length; i++) {
        const [start, end] = audioRanges[i];
        const outputName = `cut_audio_${i}.mp3`;

        await ffmpeg.exec([
          "-ss",
          `${start}`,
          "-to",
          `${end}`,
          "-i",
          "input_audio.mp3",
          "-c",
          "copy",
          "-y",
          outputName,
        ]);

        segmentFiles.push(outputName);
      }

      let finalOutput = "final_audio.mp3";

      if (segmentFiles.length > 1) {
        // Create concat list file
        const concatListContent = segmentFiles.map((f) => `file '${f}'`).join("\n");
        await ffmpeg.writeFile(
          "audio_concat_list.txt",
          new TextEncoder().encode(concatListContent)
        );

        // Concatenate segments into final output
        await ffmpeg.exec([
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          "audio_concat_list.txt",
          "-c",
          "copy",
          "-y",
          finalOutput,
        ]);
      } else {
        finalOutput = segmentFiles[0];
      }

      // Read output file
      const data = await ffmpeg.readFile(finalOutput);

      if (data.length > 0) {
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "audio/mpeg" })
        );
        setOutputAudio(url);
      } else {
        setError("Audio output file is empty.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to cut and concatenate audio.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Advanced Audio Editor</h1>

      {/* Audio File Info */}
      {audioFile && (
        <p className="text-sm text-gray-400 mb-4">
          Selected file: <strong>{audioFile.name}</strong> (
          {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}

      {/* Audio preview to get duration */}
      {audioFile && (
        <audio
          src={URL.createObjectURL(audioFile)}
          controls
          onLoadedMetadata={(e) =>
            setAudioDuration(e.currentTarget.duration)
          }
          className="mb-4 w-full rounded shadow-md"
        />
      )}

      {/* Audio input */}
      <label
        htmlFor="audio-input"
        className="mb-2 font-semibold cursor-pointer text-indigo-400 hover:underline"
      >
        Choose Audio File
      </label>
      <input
        id="audio-input"
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        disabled={processing}
        className="mb-6 w-full p-2 bg-gray-800 rounded border border-gray-600 cursor-pointer"
      />

      {/* Audio Cut Ranges */}
      {audioFile && (
        <div className="mb-6 w-full">
          <label className="block font-semibold mb-4 text-indigo-300">
            Audio Cut Ranges
          </label>

          {audioRanges.map(([start, end], idx) => (
            <div
              key={idx}
              className="mb-5 p-4 bg-gray-800 rounded shadow-inner flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                <span>
                  Range {idx + 1}: <strong>{start}s</strong> → <strong>{end}s</strong>
                </span>
                <button
                  disabled={audioRanges.length === 1}
                  onClick={() => {
                    if (audioRanges.length === 1) return;
                    const updated = audioRanges.filter((_, i) => i !== idx);
                    setAudioRanges(updated);
                  }}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    audioRanges.length === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
                  aria-label={`Remove range ${idx + 1}`}
                >
                  ✕ Remove
                </button>
              </div>

              <label
                htmlFor={`start-range-${idx}`}
                className="text-xs text-gray-400"
              >
                Start: {start}s
              </label>
              <input
                id={`start-range-${idx}`}
                type="range"
                min={0}
                max={audioDuration ?? 1000}
                step={1}
                value={start}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = [...audioRanges];
                  updated[idx][0] = Math.min(val, updated[idx][1] - 1);
                  setAudioRanges(updated);
                }}
                className="w-full accent-indigo-500"
              />

              <label
                htmlFor={`end-range-${idx}`}
                className="text-xs text-gray-400 mt-2"
              >
                End: {end}s
              </label>
              <input
                id={`end-range-${idx}`}
                type="range"
                min={0}
                max={audioDuration ?? 0}
                step={1}
                value={end}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = [...audioRanges];
                  updated[idx][1] = Math.max(val, updated[idx][0] + 1);
                  setAudioRanges(updated);
                }}
                className="w-full accent-indigo-500"
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              disabled={!audioDuration}
              onClick={() =>
                setAudioRanges([
                  ...audioRanges,
                  [0, Math.min(10, audioDuration ?? 10)],
                ])
              }
              className={`px-4 py-2 rounded font-semibold ${
                !audioDuration
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
              aria-label="Add new audio range"
            >
              + Add Range
            </button>

            <button
              onClick={() =>
                audioDuration && setAudioRanges([[0, Math.floor(audioDuration)]])
              }
              className="px-4 py-2 rounded font-semibold bg-yellow-600 hover:bg-yellow-700"
              aria-label="Reset to full audio range"
            >
              Reset Ranges
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mb-4 text-red-500 font-semibold">{error}</p>}

      {/* Processing */}
      {processing && (
        <p className="mb-4 text-indigo-400 font-semibold">Processing...</p>
      )}

      {/* Action Buttons */}
      <button
        onClick={cutAndConcatAudio}
        disabled={processing || !audioFile}
        className="px-6 py-3 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold w-full"
        aria-label="Cut and concatenate audio"
      >
        Cut & Concatenate Audio
      </button>

      {/* Output Audio */}
      {outputAudio && (
        <div className="mt-8 w-full flex flex-col items-center gap-4">
          <audio
            src={outputAudio}
            controls
            className="rounded shadow-lg max-w-full"
            onError={(e) => {
              console.error("Audio playback error", e);
              alert("Audio playback error! Check console.");
            }}
          />

          <a
            href={outputAudio}
            download="processed_audio.mp3"
            className="text-blue-400 underline font-semibold"
          >
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
}
