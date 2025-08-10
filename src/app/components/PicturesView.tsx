"use client";

import Image from "next/image";
import { useState } from "react";


interface Picture {
  id: number | string;
  title: string;
  description: string;
  picture: string;
  pictureUrl:string;
  userId:number;
  createdAt: string;
}

interface PictrueProps {
  pictures: Picture[];
}
export default function PicturesView({pictures}:PictrueProps) {
  const [images, setImages] = useState<Picture[]>(pictures || []);
  const [loaded, setLoaded] = useState<boolean[]>(new Array(images?.length).fill(false));

  const resetLoaded = (newLength: number) => {
    setLoaded(new Array(newLength).fill(false));
  };

  const handleLoad = (index: number) => {
    setLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const deleteImage = (index: number) => {
    const filtered = images.filter((_, i) => i !== index);
    setImages(filtered);
    resetLoaded(filtered?.length);
  };

  const copyImageLink = (src: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = origin + src;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        alert("Image link copied to clipboard!");
      });
    } else {
      alert("Clipboard API not supported");
    }
  };


  return (
   <main className="max-w-7xl mx-auto px-4 py-10">
  <h1 className="text-4xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-10 drop-shadow-sm tracking-tight">
    🌄 Beautiful Image Gallery
  </h1>

  {images?.length === 0 && (
    <p className="text-center text-gray-500 dark:text-gray-400 text-lg">No images to display.</p>
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {images.map((image, idx) => (
      <div
        key={idx}
        className="relative overflow-hidden rounded-2xl shadow-xl border border-indigo-100/30 
        hover:shadow-indigo-300 dark:hover:shadow-indigo-800 
        hover:scale-[1.03] transition-all duration-300 group bg-white/10 backdrop-blur-md"
      >
        {/* Loading spinner */}
        {!loaded[idx] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900/80 z-10">
            <svg
              className="animate-spin h-10 w-10 text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        )}

        <Image
          src={image?.pictureUrl ? image.pictureUrl:image.picture}
          alt={image?.pictureUrl ? image.pictureUrl:image.picture}
          width={400}
          height={300}
          className={`w-full h-64 object-cover rounded-2xl transition-opacity duration-700 ${
            loaded[idx] ? "opacity-100" : "opacity-0"
          }`}
          priority={idx === 0}
          onLoadingComplete={() => handleLoad(idx)}
        />

        {/* Buttons container */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          {/* Copy Button */}
          <button
            onClick={() => copyImageLink(image.picture)}
            aria-label="Copy Image Link"
            className="group relative p-2 rounded-full backdrop-blur bg-white/70 hover:bg-indigo-600 hover:text-white text-gray-700 transition-all shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16h8M8 12h8m-7 8h7a2 2 0 002-2v-6a2 2 0 00-2-2h-1M5 16h3a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 rounded bg-indigo-900 px-2 py-1 text-xs text-white whitespace-nowrap transition-all group-hover:scale-100">
              Copy Link
            </span>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => deleteImage(idx)}
            aria-label="Delete Image"
            className="group relative p-2 rounded-full backdrop-blur bg-white/70 hover:bg-red-600 hover:text-white text-gray-700 transition-all shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
              />
            </svg>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 rounded bg-red-900 px-2 py-1 text-xs text-white whitespace-nowrap transition-all group-hover:scale-100">
              Delete
            </span>
          </button>
        </div>
      </div>
    ))}
  </div>
</main>

  );
}
