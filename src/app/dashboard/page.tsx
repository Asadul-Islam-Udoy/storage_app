"use client";
import NavbarSidebar from "../layout/NavbarSidebar";
import { PlayCircle, Music2, Image as Img, HardDrive } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Videos", value: '3', icon: PlayCircle, color: "from-blue-500 to-indigo-500" },
    { label: "Audio", value: '70', icon: Music2, color: "from-green-500 to-emerald-400" },
    { label: "Pictures", value: '100', icon: Img, color: "from-pink-500 to-rose-500" },
    { label: "Storage Used", value: "62%", icon: HardDrive, color: "from-purple-500 to-violet-500" },
  ];

  const recentMedia = [
    { id: 1, type: "video", title: "Mountain Adventure", url: "/mountain.mp4" },
    { id: 2, type: "audio", title: "Relaxing Piano", url: "/piano.mp3" },
    { id: 3, type: "image", title: "Spring Blossoms", url: "/spring.jpg" },
    { id: 4, type: "video", title: "Cooking Masterclass", url: "/cooking.mp4" },
  ];

  return (
    <div className="flex md:h-[700px] overflow-scroll scrollbar-hidden bg-black bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Sidebar */}
      <NavbarSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 mt-10  h-[700px] overflow-scroll  md:p-12 scrollbar-hidden">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-3xl p-10 shadow-xl mb-12 hover:shadow-purple-600/40 transition">
          <h1 className="text-4xl font-extrabold text-white">
            Welcome Back 🌙
          </h1>
          <p className="text-gray-300 mt-3 max-w-xl">
            Dive into your personal media library with a sleek dark interface.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 hover:shadow-indigo-500/30 transition-transform"
            >
              <div
                className={`bg-gradient-to-br ${stat.color} p-4 rounded-full shadow-md`}
              >
                <stat.icon size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mt-4">{stat.value}</h2>
              <p className="text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Media */}
        <h2 className="text-2xl font-semibold mb-8">Recent Uploads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentMedia.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-indigo-500/40 hover:scale-[1.03] transition"
            >
              {item.type === "video" && (
                <video src={item.url} controls className="w-full h-48 object-cover" />
              )}
              {item.type === "audio" && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <audio controls className="w-full mt-3">
                    <source src={item.url} type="audio/mp3" />
                  </audio>
                </div>
              )}
              {item.type === "image" && (
                <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 border-t border-gray-700 flex justify-between items-center">
                <p className="font-medium text-gray-200">{item.title}</p>
                <button className="px-4 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 transition text-white">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
