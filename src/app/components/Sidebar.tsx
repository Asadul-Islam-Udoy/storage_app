"use client";
import Link from "next/link";
import { Home, UploadCloud, Video } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="w-5 h-5" />,
    clildLists: [],
  },
  {
    name: "Videos",
    icon: <Video className="w-5 h-5" />,
    clildLists: [
      {
        name: "Views",
        href: "/pages/videos/views",
        icon: <Home className="w-5 h-5" />,
      },
            {
        name: "Lists",
        href: "/pages/videos/lists",
        icon: <Home className="w-5 h-5" />,
      },
      {
        name: "Upload",
        href: "/upload-video",
        icon: <Home className="w-5 h-5" />,
      },
      {
        name: "Edit",
        href: "/pages/videos/edit",
        icon: <Home className="w-5 h-5" />,
      },
    ],
  },
  {
    name: "Pictures",
    icon: <UploadCloud className="w-5 h-5" />,
    clildLists: [
        {
        name: "Views",
        href: "/pages/pictures/views",
        icon: <Home className="w-5 h-5" />,
      },
      {
        name: "Upload",
        href: "/upload-pictures",
        icon: <Home className="w-5 h-5" />,
      },

      {
        name: "Edit",
        href: "/edit-picture",
        icon: <Home className="w-5 h-5" />,
      },
    ],
  },
];

interface SidebarPops {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Sidebar({ isOpen, setIsOpen }: SidebarPops) {
  const pathname = usePathname();
  const [childShow, setChileShow] = useState("");
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 h-full w-72
          bg-white/20 backdrop-blur-lg border-r border-white/30
          text-white
          shadow-xl
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-8 flex flex-col h-full">
          <h2 className="text-2xl font-extrabold mb-10 text-gray-700 select-none">
            🎬 Dashboard
          </h2>
          <nav className="flex flex-col gap-3">
            {links.map(({ name, icon, href, clildLists }) => {
              return (
                <div key={name}>
                  {href ? (
                    <Link
                      href={href}
                      key={name}
                      onClick={() => setIsOpen(true)}
                      className="
                      flex items-center border gap-1 px-4 py-3 rounded-lg font-medium transition text-indigo-500 hover:bg-indigo-800/50 hover:text-white"
                    >
                      {icon}
                      <span>{name}</span>
                    </Link>
                  ) : (
                    <p
                      key={name}
                      onClick={() =>
                        setChileShow((pre) => (pre == name ? "" : name))
                      }
                      className="
                    flex items-center  gap-1 px-4 py-3 rounded-lg font-medium transition text-indigo-500 hover:bg-indigo-500/50 hover:text-white"
                    >
                      {icon}
                      <span>{name}</span>
                    </p>
                  )}
                  {clildLists?.length > 0 &&
                    childShow == name &&
                    clildLists?.map(({ name, href, icon }) => {
                      const active = pathname === href;
                      return (
                        <div key={name}>
                          <Link
                            key={name}
                            href={href}
                            onClick={() => setChileShow((pre) => pre)}
                            className={`
                    flex items-center gap-3 ml-6  transform-3d px-4 py-3 rounded-lg font-medium transition
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
                        </div>
                      );
                    })}
                </div>
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
