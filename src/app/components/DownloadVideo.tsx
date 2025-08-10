"use client";

import { useState } from "react";

export default function DownloadVideo() {
  const [url, setUrl] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const handleDownload = async () => {
    if (!url) {
      alert("Please enter a YouTube URL");
      return;
    }

    try {
      const res = await fetch("/api/videos/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url }),
      });

      const data = await res.json();

      if (data.success) {
        setDownloadLink(data.url);
      } else {
        alert(data.error || "Download failed");
      }
    } catch (err) {
      alert("Unexpected error occurred");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 py-12">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🎥 Video Downloader
        </h1>

        <input
          type="text"
          placeholder="Paste YouTube or video URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />

        <button
          onClick={handleDownload}
          className="w-full mt-4 py-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          Download
        </button>

        {downloadLink && (
          <div className="mt-6 text-center">
            <a
              href={downloadLink}
              download
              className="inline-block text-orange-400 hover:underline transition"
            >
              ⬇️ Click here to download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
