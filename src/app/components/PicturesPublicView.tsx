"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar2 from "./Navbar2";

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

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function PicturePublicViews() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const imagesPerPage = 6;

  const filteredImages = useMemo(() => {
    return imagesData.filter((image) =>
      image.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

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
        Public Picture Gallery
        <span className="block w-24 h-1 bg-orange-400 mx-auto rounded-full mt-2"></span>
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center my-10">
        <div className="relative w-full md:w-1/2">
          <span className="absolute left-4 top-3.5 text-orange-400 text-xl select-none">🔍</span>
          <input
            type="text"
            placeholder="Search pictures..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Loading or Image Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-12">
            {currentImages.length > 0 ? (
              currentImages.map((image) => (
                <Link key={image.id} href={`/pages/pictures/views/${image.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-700 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/40 transition-all cursor-pointer"
                  >
                    <div className="relative group overflow-hidden rounded-t-xl">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-56 object-cover transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{image.title}</h2>
                      <p className="text-gray-400 text-sm">Click to view</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">No pictures found.</p>
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
