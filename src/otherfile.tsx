      {/* Time selection sliders */}
        //const [startTime, setStartTime] = useState<number>(0);
          //const [endTime, setEndTime] = useState<number>(0);
      {/* {videoDuration && (
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
      )} */}

        // <button
        //   onClick={() => cutVideo(startTime, endTime - startTime)}
        //   disabled={processing || inputFiles.length === 0}
        //   className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        // >
        //   Cut Video ({startTime}s → {endTime - startTime}s)
        // </button>


        // Cut video segment
//   const cutVideo = async (startTime = 5, duration = 5) => {
//     if (!ffmpeg || !fetchFile || inputFiles.length === 0) return;
//     setProcessing(true);
//     setError(null);

//     try {
//       await ffmpeg.writeFile("input0.mp4", await fetchFile(inputFiles[0]));

//       await ffmpeg.exec([
//         "-ss",
//         `${startTime}`,
//         "-t",
//         `${duration}`,
//         "-i",
//         "input0.mp4",
//         "-vf",
//         "fps=30",
//         "-c:v",
//         "libx264",
//         "-c:a",
//         "aac",
//         "-preset",
//         "fast",
//         "-movflags",
//         "faststart",
//         "-strict",
//         "experimental",
//         "-y",
//         "cut.mp4",
//       ]);
//       const data = await ffmpeg.readFile("cut.mp4");
//       if (data.length > 0) {
//         const url = URL.createObjectURL(
//           new Blob([data.buffer], { type: "video/mp4" })
//         );
//         setOutputVideo(url);
//       } else {
//         setError("Output file is empty");
//       }
//     } catch (e) {
//       setError("Cutting video failed");
//       console.error(e);
//     } finally {
//       setProcessing(false);
//     }
//   };



////////////////////end single video cut
