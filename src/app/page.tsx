"use client";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { LogIn, Video, Music, Image, FileText, Folder, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";
const FloatingDots = dynamic(() => import('./components/FloatingDots'), {
  ssr: false,
});
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login for demo
    setIsLoggedIn(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Floating dots background */}
      <FloatingDots />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-black/50 backdrop-blur-md fixed w-full z-50 shadow-lg">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-widest text-orange-400 select-none"
        >
          🎬 Storage App
        </Link>
        {!isLoggedIn ? (
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#f97316" }}
            whileTap={{ scale: 0.95 }}
           onClick={() => router.push('/pages/login')}
            className="px-5 py-2 rounded-lg bg-orange-500 shadow-lg font-semibold text-white cursor-pointer"
          >
            <LogIn size={18} className="inline mr-2" />
            Login
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="h-10 w-10 rounded-full border-2 border-orange-400 shadow-md"
            />
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#dc2626" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLoggedIn(false)}
              className="px-5 py-2 rounded-lg bg-red-600 shadow-lg font-semibold text-white cursor-pointer"
            >
              Logout
            </motion.button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center text-center pt-40 pb-24 px-6 max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-wide leading-tight drop-shadow-lg">
          Secure & Smart <span className="text-orange-400">Cloud Storage</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10 drop-shadow">
          Store and manage your videos, audios, pictures, and documents with
          ease. Access anytime, anywhere with blazing-fast performance.
        </p>
        {!isLoggedIn && (
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#f97316" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full font-bold text-xl shadow-xl text-white tracking-wide"
          >
            Get Started
          </motion.button>
        )}
      </motion.section>

      {/* Categories Grid */}

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-8 md:px-20 pb-20 max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12 text-center tracking-wide drop-shadow">
            Your Files
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <Link href='/pages/videos/views'>
            <AnimatedCategoryCard
              icon={<Video className="w-12 h-12 text-orange-400" />}
              title="Videos"
              desc="Manage your uploaded videos"
            />
            </Link>
            <Link href='/pages/audios/views'>
            <AnimatedCategoryCard
              icon={<Music className="w-12 h-12 text-blue-400" />}
              title="Audios"
              desc="Upload and play your music files"
            />
            </Link>
            <Link href='/pages/pictures/views'>
            <AnimatedCategoryCard
              icon={<Image className="w-12 h-12 text-pink-400" />}
              title="Pictures"
              desc="Store and view your images"
            />
            </Link>
            <Link href='/pages/documents/views'>
            <AnimatedCategoryCard
              icon={<FileText className="w-12 h-12 text-green-400" />}
              title="Documents"
              desc="Keep your important docs safe"
            />
            </Link>
            <Link href='/pages/videos/views'>
            <AnimatedCategoryCard
              icon={<Folder className="w-12 h-12 text-purple-400" />}
              title="Others"
              desc="Any other file types"
            />
            </Link>
          </div>
        </motion.section>
            {/* FOOTER */}
    <Footer />
    </div>
  );
}



// Animated card component
function AnimatedCategoryCard({ icon, title, desc }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.07, boxShadow: "0 8px 24px rgba(251, 191, 36, 0.6)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gray-900/80 rounded-xl p-8 cursor-pointer border border-gray-700 shadow-lg flex flex-col items-center text-center"
      tabIndex={0}
      role="button"
      aria-label={`Open ${title}`}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2 text-yellow-400">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </motion.div>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

