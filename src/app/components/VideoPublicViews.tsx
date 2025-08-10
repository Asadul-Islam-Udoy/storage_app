"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar2 from "./Navbar2";
import Loadding from "./Loadding";

const videosData = [
  { id: 1, title: "Nature in 4K", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800" },
  { id: 2, title: "Ocean Waves", src: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: 3, title: "Mountain Timelapse", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
  { id: 4, title: "City Life", src: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.unsplash.com/photo-1503264116251-35a269479413?w=800" },
  { id: 5, title: "Sunset Vibes", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=800" },
  { id: 6, title: "Wildlife Journey", src: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800" },
  { id: 7, title: "Adventure Trail", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800" },
  { id: 8, title: "Calm Lake", src: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800" },
];

export default function VideoPublicViews() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const videosPerPage = 6;

  // Filter videos based on search
  const filteredVideos = useMemo(() => {
    return videosData.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Pagination slicing
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  // Simulate loading on search or page change
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-0">
      <Navbar2 />

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-orange-400 mb-6 text-center drop-shadow-lg">
        Public Video Gallery
        <span className="block w-24 h-1 bg-orange-400 mx-auto rounded-full mt-2"></span>
      </h1>

      {/* Search bar */}
      <div className="flex justify-center my-10">
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-4 top-3.5 text-orange-400 text-xl select-none">🔍</span>
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Loading or Video Grid */}
      {loading ? (
        <Loadding />
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-12">
            {currentVideos.length > 0 ? (
              currentVideos.map((video) => (
                <Link key={video.id} href={`/pages/videos/views/${video.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-700 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/40 transition-all cursor-pointer"
                  >
                    <div className="relative group overflow-hidden rounded-t-xl">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-56 object-cover transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{video.title}</h2>
                      <p className="text-gray-400 text-sm">Click to watch</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">No videos found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-2 pb-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 rounded-full bg-gray-700 hover:bg-orange-500 text-white transition disabled:opacity-40"
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-full transition ${
                    currentPage === index + 1
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 rounded-full bg-gray-700 hover:bg-orange-500 text-white transition disabled:opacity-40"
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
