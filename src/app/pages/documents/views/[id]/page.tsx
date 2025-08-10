"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar2 from "@/app/components/Navbar2";

const pdfsData = [
  {
    id: 1,
    title: "React Guide",
    src: "/pdfs/react-guide.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=React+Guide",
  },
  {
    id: 2,
    title: "Next.js Tutorial",
    src: "/pdfs/nextjs-tutorial.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Next.js+Tutorial",
  },
  {
    id: 3,
    title: "Tailwind CSS Handbook",
    src: "/pdfs/tailwind-css.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Tailwind+CSS",
  },
];

export default function PdfDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const pdf = pdfsData.find((item) => item.id === id);

  if (!pdf) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
        <Navbar2 />
        <h1 className="text-3xl font-bold mb-4 mt-20 text-center">PDF Not Found</h1>
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-0 px-4 md:px-0">
  
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-orange-400 drop-shadow-lg text-center max-w-3xl w-full">
        {pdf.title}
      </h1>

      <div className="w-full max-w-5xl rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-gray-900 p-2">
        <embed
          src={pdf.src}
          type="application/pdf"
          width="100%"
          height="80vh" // dynamic height for responsiveness
          className="rounded"
        />
      </div>

      <button
        onClick={() => router.back()}
        className="mt-8 px-6 py-3 bg-gray-700 rounded-lg hover:bg-orange-500 transition self-start md:self-auto"
      >
        ◀ Back
      </button>
    </div>
  );
}
