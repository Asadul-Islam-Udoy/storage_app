"use client";
import Link from "next/link";
import {
  Video,
  Film,
  Upload,
  Image,
  Images,
  Pencil,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    childLists: [],
  },
  {
    name: "Videos",
    icon: <Film className="w-5 h-5" />,
    childLists: [
      { name: "My Videos", href: "/pages/videos/views", icon: <Video className="w-4 h-4" /> },
      { name: "Playlists", href: "/pages/videos/lists", icon: <Images className="w-4 h-4" /> },
      { name: "Upload Video", href: "/upload-video", icon: <Upload className="w-4 h-4" /> },
      { name: "Edit Video", href: "/pages/videos/edit", icon: <Pencil className="w-4 h-4" /> },
    ],
  },
  {
    name: "Pictures",
    icon: <Image className="w-5 h-5" />,
    childLists: [
      { name: "Gallery", href: "/pages/pictures/views", icon: <Images className="w-4 h-4" /> },
      { name: "Upload Picture", href: "/upload-pictures", icon: <Upload className="w-4 h-4" /> },
      { name: "Edit Picture", href: "/edit-picture", icon: <Pencil className="w-4 h-4" /> },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleNavigation = (href: string) => {
    setLoading(true);
    router.push(href);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 md:mt-16 h-[calc(100vh-3.5rem)] w-72
          bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950
          border-r border-indigo-700/40
          text-white shadow-xl
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:full md:shadow-none
        `}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <h2 className="text-2xl font-extrabold mb-10 text-indigo-200 tracking-wide select-none flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-300" />
            My Studio
          </h2>

          <nav className="flex flex-col gap-2 flex-grow">
            {links.map(({ name, icon, href, childLists }) => {
              const isActiveParent = href === pathname || childLists.some((c) => c.href === pathname);
              const isOpenMenu = openMenus.includes(name) || isActiveParent;

              if (href) {
                return (
                  <button
                    key={name}
                    onClick={() => handleNavigation(href)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition w-full text-left
                      ${
                        pathname === href
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-indigo-200 hover:bg-indigo-700/50"
                      }
                    `}
                  >
                    {icon}
                    <span>{name}</span>
                  </button>
                );
              }

              return (
                <div key={name}>
                  <button
                    onClick={() => toggleMenu(name)}
                    className={`
                      flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition
                      ${
                        isActiveParent
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-indigo-200 hover:bg-indigo-700/50"
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">{icon}{name}</span>
                    {isOpenMenu ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  <div
                    className={`mt-1 overflow-hidden transition-all duration-300 ${
                      isOpenMenu ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    {childLists.map(({ name: childName, href: childHref, icon: childIcon }) => {
                      const activeChild = pathname === childHref;
                      return (
                        <button
                          key={childName}
                          onClick={() => handleNavigation(childHref)}
                          className={`
                            flex items-center gap-3 ml-8 px-4 py-2 rounded-md text-sm font-medium transition w-full text-left
                            ${
                              activeChild
                                ? "bg-indigo-500 text-white shadow-inner"
                                : "text-indigo-300 hover:bg-indigo-600/50"
                            }
                          `}
                        >
                          {childIcon}
                          {childName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Beautiful Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-200 font-medium animate-pulse">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
