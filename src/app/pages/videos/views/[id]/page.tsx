"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar2 from "@/app/components/Navbar2";


// Same data for demo — in real use, fetch from DB/API
const videosData = [
  { id: 1, title: "Nature in 4K", src: "https://www.w3schools.com/html/mov_bbb.mp4", description: "A stunning look at nature in ultra high definition.", thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800" },
  { id: 2, title: "Ocean Waves", src: "https://www.w3schools.com/html/movie.mp4", description: "Relax with calming ocean waves.", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: 3, title: "Mountain Timelapse", src: "https://www.w3schools.com/html/mov_bbb.mp4", description: "A breathtaking mountain timelapse.", thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
];

export default function VideoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.id);

  const video = videosData.find((v) => v.id === videoId);

  if (!video) {
    return (
      <div className="text-center mt-20 text-white">
        <Navbar2 />
        <p>Video not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar2 />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <video
          controls
          poster={video.thumbnail}
          className="w-full rounded-lg shadow-lg border border-gray-700"
        >
          <source src={video.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="text-3xl font-bold mt-6">{video.title}</h1>
        <p className="text-gray-400 mt-2">{video.description}</p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
        >
          ◀ Back to Videos
        </button>
      </div>
    </div>
  );
}
