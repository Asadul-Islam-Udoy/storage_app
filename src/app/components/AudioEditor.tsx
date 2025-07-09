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



  // Initialize endTime to videoDuration on load
  useEffect(() => {
    if (audioDuration !== null)
      setAudioRanges([[0, Math.floor(audioDuration)]]);
  }, [audioDuration]);


  // Handle audio file input
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setOutputAudio(null);
    }
  };


  ///audio cut and marge
  const cutAndConcatAudio = async () => {
    if (!ffmpeg || !audioFile || audioRanges.length === 0) {
      setError("No audio file or no ranges selected.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Write audio file
      await ffmpeg.writeFile("input_audio.mp3", await fetchFile(audioFile));

      const segmentFiles: string[] = [];

      // Cut each range into a segment file
      for (let i = 0; i < audioRanges.length; i++) {
        const [start, end] = audioRanges[i];
        const output = `cut_audio_${i}.mp3`;

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
          output,
        ]);

        segmentFiles.push(output);
      }

      // Concatenate segments if >1
      let finalOutput = "final_audio.mp3";

      if (segmentFiles.length > 1) {
        const concatList = segmentFiles.map((f) => `file '${f}'`).join("\n");
        await ffmpeg.writeFile(
          "audio_concat_list.txt",
          new TextEncoder().encode(concatList)
        );

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

      const data = await ffmpeg.readFile(finalOutput);

      if (data.length > 0) {
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "audio/mpeg" })
        );
        setOutputAudio(url); // re-use outputVideo or make a new state for `outputAudio`
      } else {
        setError("Audio output file is empty.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to cut audio.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Advanced Audio Editor</h1>
      {/* Hidden video to get duration */}
      {audioFile && (
        <video
          src={URL.createObjectURL(audioFile)}
          width={480}
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
          controls
          className="h-10"
        />
      )}
      <label>Audio</label>
      {/* Audio input */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        disabled={processing}
        className="mb-4 p-2 bg-gray-800 rounded border border-gray-600 cursor-pointer"
      />

      {/* audio range */}
      {audioFile && (
        <div className="mb-4">
          <label className="font-semibold block"> Audion Cut Ranges</label>
          {audioRanges.map(([start, end], idx) => (
            <div key={idx} className="flex gap-1 my-2 p-2 bg-gray-800 rounded">
              <div className="flex justify-between text-sm text-gray-300">
                <span>
                  Range {idx + 1}: {start}s → {end}s
                </span>
                <button
                  onClick={() => {
                    const updated = audioRanges.filter((_, i) => i !== idx);
                    setAudioRanges(updated);
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
                max={audioDuration || 1000}
                step={1}
                value={start}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = [...audioRanges];
                  updated[idx][0] = Math.min(val, updated[idx][1] - 1); // prevent start >= end
                  setAudioRanges(updated);
                }}
              />

              {/* End Slider */}
              <label className="text-xs mt-1 text-gray-400">End: {end}s</label>
              <input
                type="range"
                min={0}
                max={audioDuration || 0}
                step={1}
                value={end}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = [...audioRanges];
                  updated[idx][1] = Math.max(val, updated[idx][0] + 1); // prevent end <= start
                  setAudioRanges(updated);
                }}
              />
            </div>
          ))}

          <button
            onClick={() => setAudioRanges([...audioRanges, [0, 10]])}
            className="mt-2 px-3 py-1 bg-green-600 rounded"
          >
            + Add Range
          </button>
        </div>
      )}
      {/* Error message */}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Action buttons */}

      <div className="space-x-4 mb-6">
        <button
          onClick={cutAndConcatAudio}
          disabled={processing || !audioFile}
          className="px-4 py-2 cursor-pointer rounded bg-red-500 hover:bg-red-800 disabled:opacity-50"
        >
          Cut Audio
        </button>

      </div>

      {/* Processed video output */}
      {processing && <p className="mb-4 text-indigo-400">Processing...</p>}
      {outputAudio && (
        <audio
          src={outputAudio}
          controls
          className="rounded shadow-lg max-w-full"
          onError={(e) => {
            console.error("Audio playback error", e);
            alert("Audio playback error! Check console.");
          }}
        />
      )}

      {outputAudio && (
        <a
          href={outputAudio}
          download="processed_audio.mp3"
          className="text-blue-400 underline mt-2 block"
        >
          Download Audio
        </a>
      )}
    </div>
  );
}
