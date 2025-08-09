"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar2 from "@/app/components/Navbar2";

const audiosData = [
  { id: 1, title: "Relaxing Ocean Waves", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
  { id: 2, title: "Birds in Forest", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", thumbnail: "https://images.unsplash.com/photo-1503264116251-35a269479413?w=400" },
  { id: 3, title: "Calm Piano Music", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", thumbnail: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400" },
  // Add more audio data here
];

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function AudioList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const audiosPerPage = 3;

  const filteredAudios = useMemo(() => {
    return audiosData.filter((audio) =>
      audio.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const indexOfLastAudio = currentPage * audiosPerPage;
  const indexOfFirstAudio = indexOfLastAudio - audiosPerPage;
  const currentAudios = filteredAudios.slice(indexOfFirstAudio, indexOfLastAudio);
  const totalPages = Math.ceil(filteredAudios.length / audiosPerPage);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-0 px-0 md:px-1">
      <Navbar2 />

      <div className="flex justify-center my-8">
        <div className="relative w-full max-w-md">
          <span className="absolute left-4 top-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search audios..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentAudios.length > 0 ? (
              currentAudios.map((audio) => (
                <Link key={audio.id} href={`/pages/audios/views/${audio.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-orange-400 hover:shadow-orange-500/50 transition-all cursor-pointer flex flex-col"
                  >
                    <img
                      src={audio.thumbnail}
                      alt={audio.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4 flex-grow">
                      <h2 className="text-lg font-semibold">{audio.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">Click to listen</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">
                No audios found.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-2 pb-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-700 rounded-full hover:bg-orange-500 disabled:opacity-50"
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === index + 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 hover:bg-orange-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-700 rounded-full hover:bg-orange-500 disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
