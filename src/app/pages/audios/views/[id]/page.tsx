"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar2 from "@/app/components/Navbar2";

const audiosData = [
  { id: 1, title: "Relaxing Ocean Waves", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
  { id: 2, title: "Birds in Forest", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", thumbnail: "https://images.unsplash.com/photo-1503264116251-35a269479413?w=400" },
  { id: 3, title: "Calm Piano Music", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", thumbnail: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400" },
  // Add more audio data here
];

export default function AudioPublicView() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const audio = audiosData.find((item) => item.id === id);

  if (!audio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-0">
        <Navbar2 />
        <h1 className="text-3xl font-bold mb-4">Audio Not Found</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-0 px-1 sm:px-2 md:px-1 lg:px-2 xl:px-0">
      <Navbar2 />

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-orange-400 drop-shadow-lg text-center max-w-3xl mx-auto">
        {audio.title}
      </h1>

      <div className="max-w-md w-full rounded-lg overflow-hidden shadow-lg border border-gray-700 mx-auto bg-gray-900 p-4 flex flex-col items-center gap-6">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-48 object-cover rounded-md"
          loading="lazy"
          draggable={false}
        />
        <audio controls className="w-full rounded-md focus:ring-2 focus:ring-orange-400">
          <source src={audio.src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
