"use client";
import Link from "next/link";
import {Home, UploadCloud, Video } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { name: "Upload", href: "/upload", icon: <UploadCloud className="w-5 h-5" /> },
  { name: "Watch", href: "/watch", icon: <Video className="w-5 h-5" /> },
];

interface SidebarPops{
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}
export default function Sidebar({isOpen,setIsOpen}:SidebarPops) {
  const pathname = usePathname();
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed md:top-18  left-0 h-full w-72
          bg-white/20 backdrop-blur-lg border-r border-white/30
          text-white
          shadow-xl
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-8 flex flex-col h-full">
          <h2 className="text-3xl font-extrabold mb-10 text-indigo-100 select-none">
            🎬 VideoApp
          </h2>
          <nav className="flex flex-col gap-6">
            {links.map(({ name, href, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition
                    ${
                      active
                        ? "bg-indigo-600 shadow-lg border-l-4 border-indigo-400 text-white"
                        : "text-indigo-200 hover:bg-indigo-500/50 hover:text-white"
                    }
                  `}
                >
                  {icon}
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {/* {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
        />
      )} */}
    </>
  );
}
