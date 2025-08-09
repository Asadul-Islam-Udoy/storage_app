"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar2 from "@/app/components/Navbar2";

const pdfsData = [
  {
    id: 1,
    title: "Dummy PDF",
    src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Dummy+PDF",
  },
  {
    id: 2,
    title: "Adobe Sample Explain",
    src: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Adobe+Sample",
  },
  {
    id: 3,
    title: "Orimi PDF Test",
    src: "https://www.orimi.com/pdf-test.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Orimi+PDF+Test",
  },
  {
    id: 4,
    title: "Apollo 17 Flight Plan",
    src: "https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Apollo+17+Flight+Plan",
  },
  {
    id: 5,
    title: "IRS Form 1040",
    src: "https://www.irs.gov/pub/irs-pdf/f1040.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=IRS+Form+1040",
  },
  {
    id: 6,
    title: "NASA Apollo 11 Flight Plan",
    src: "https://www.nasa.gov/sites/default/files/atoms/files/apollo_11_flight_plan.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Apollo+11+Flight+Plan",
  },
  {
    id: 7,
    title: "GRE Research Validity Data",
    src: "https://www.ets.org/s/gre/pdf/gre_research_validity_data.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=GRE+Research+Data",
  },
  {
    id: 8,
    title: "Nobel Prize Chemistry Lecture",
    src: "https://www.nobelprize.org/uploads/2018/06/advanced-chemistry-prize-lecture.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=Nobel+Prize+Lecture",
  },
  {
    id: 9,
    title: "War and Peace PDF",
    src: "https://www.gutenberg.org/files/2600/2600-0.txt.pdf",
    thumbnail: "https://via.placeholder.com/300x400?text=War+and+Peace",
  },
  {
    id: 10,
    title: "FDA Guidance Document",
    src: "https://www.fda.gov/media/71990/download",
    thumbnail: "https://via.placeholder.com/300x400?text=FDA+Guidance",
  },
];

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function PdfList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pdfsPerPage = 6;

  const filteredPdfs = useMemo(() => {
    return pdfsData.filter((pdf) =>
      pdf.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const indexOfLastPdf = currentPage * pdfsPerPage;
  const indexOfFirstPdf = indexOfLastPdf - pdfsPerPage;
  const currentPdfs = filteredPdfs.slice(indexOfFirstPdf, indexOfLastPdf);
  const totalPages = Math.ceil(filteredPdfs.length / pdfsPerPage);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-0 px-4 md:px-1">
      <Navbar2 />

      <div className="flex justify-center my-8">
        <div className="relative w-full max-w-md">
          <span className="absolute left-4 top-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search PDFs..."
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentPdfs.length > 0 ? (
              currentPdfs.map((pdf) => (
                <a
                  key={pdf.id}
                  href={pdf.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-orange-400 hover:shadow-orange-500/50 transition-all"
                  >
                    <iframe src={pdf.src} width="100%" height="600px" />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{pdf.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Click to view
                      </p>
                    </div>
                  </motion.div>
                </a>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">
                No PDFs found.
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
