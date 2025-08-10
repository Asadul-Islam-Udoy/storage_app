"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Navbar2() {
  const router = useRouter();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 text-white flex items-center justify-between px-4 py-3 shadow-lg">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors"
      >
        ◀ Back
      </button>

      {/* Logo / Title */}
      <h1 className="text-xl font-bold text-orange-400 tracking-wide">
        Stroage App
      </h1>

      {/* Links */}
      <div className="space-x-4 hidden sm:block">
        {/* <a href="/" className="hover:text-orange-400">Home</a>
        <a href="/videos" className="hover:text-orange-400">Videos</a> */}
      </div>
    </nav>
  );
}

export default Navbar2;
