"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar2 from "@/app/components/Navbar2";

const imagesData = [
  { id: 1, title: "Md Asadul Islam", src: "/personal/a.png" },
  { id: 2, title: "Subrotto Sarkar", src: "/personal/b.png" },
  { id: 3, title: "Rakibul Islam", src: "/personal/c.png" },
  { id: 4, title: "Mostafizur Rahman", src: "/personal/d.png" },
  { id: 5, title: "Anisur Rahman", src: "/personal/f.png" },
  { id: 6, title: "Sabbir Limon", src: "/personal/g.png" },
  { id: 7, title: "Wildflowers", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800" },
  { id: 8, title: "Snowy Mountains", src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800" },
];

export default function PictureDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const image = imagesData.find((img) => img.id === id);

  if (!image) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
        <Navbar2 />
        <h1 className="text-3xl font-bold mb-4">Picture Not Found</h1>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-0 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-4">
      <Navbar2 />

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-orange-400 drop-shadow-lg text-center max-w-3xl mx-auto">
        {image.title}
      </h1>

      <div className="max-w-5xl w-full rounded-lg overflow-hidden shadow-lg border border-gray-700 mx-auto">
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-auto object-contain"
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  );
}
