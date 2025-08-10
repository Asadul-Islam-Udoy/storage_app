
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  List,
  Video,
  ListVideo,
  Upload,
  Edit,
  Download,
  Music,
  Music2,
  Image,
  Images,
  File,
  FilePlus,
  User,
  UserCog,
  UserCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    childLists: [],
  },
  {
    name: "Users",
    icon: <Users className="w-5 h-5" />,
    childLists: [
      { name: "Permission", href: "/pages/dashboard/users/user-permission", icon: <ShieldCheck className="w-4 h-4" /> },
      { name: "User Lists", href: "/pages/dashboard/users/users-list", icon: <List className="w-4 h-4" /> },
    ],
  },
  {
    name: "Videos",
    icon: <Video className="w-5 h-5" />,
    childLists: [
      { name: "My Videos", href: "/pages/dashboard/videos/views", icon: <ListVideo className="w-4 h-4" /> },
      { name: "Playlists", href: "/pages/dashboard/videos/lists", icon: <List className="w-4 h-4" /> },
      { name: "Upload Video", href: "/pages/dashboard/videos/upload-video", icon: <Upload className="w-4 h-4" /> },
      { name: "Edit Video", href: "/pages/dashboard/videos/edit", icon: <Edit className="w-4 h-4" /> },
      { name: "Download Video", href: "/pages/dashboard/videos/download", icon: <Download className="w-4 h-4" /> },
    ],
  },
  {
    name: "Audios",
    icon: <Music className="w-5 h-5" />,
    childLists: [
      { name: "My Audios", href: "/pages/dashboard/audios/views", icon: <Music2 className="w-4 h-4" /> },
      { name: "Audio Playlists", href: "/pages/dashboard/audios/lists", icon: <List className="w-4 h-4" /> },
      { name: "Upload Audio", href: "/pages/dashboard/audios/upload", icon: <Upload className="w-4 h-4" /> },
      { name: "Edit Audio", href: "/pages/dashboard/audios/edit", icon: <Edit className="w-4 h-4" /> },
      { name: "Download Audio", href: "/pages/dashboard/audios/download", icon: <Download className="w-4 h-4" /> },
    ],
  },
  {
    name: "Pictures",
    icon: <Image className="w-5 h-5" />,
    childLists: [
      { name: "Gallery", href: "/pages/dashboard/pictures/views", icon: <Images className="w-4 h-4" /> },
      { name: "Upload Picture", href: "/pages/dashboard/pictures/upload", icon: <Upload className="w-4 h-4" /> },
      { name: "Edit Picture", href: "/pages/dashboard/pictures/edits", icon: <Edit className="w-4 h-4" /> },
    ],
  },
  {
    name: "Other Documents",
    icon: <File className="w-5 h-5" />,
    childLists: [
      { name: "Files Views", href: "/pages/dashboard/others_file/views", icon: <File className="w-4 h-4" /> },
      { name: "Upload File", href: "/pages/dashboard/others_file/upload", icon: <FilePlus className="w-4 h-4" /> },
    ],
  },
  {
    name: "Profile",
    icon: <User className="w-5 h-5" />,
    childLists: [
      { name: "Profile View", href: "/pages/dashboard/profile/views", icon: <UserCircle className="w-4 h-4" /> },
      { name: "Profile Edit", href: "/pages/dashboard/profile/edit", icon: <UserCog className="w-4 h-4" /> },
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
          fixed top-14 scrollbar-hidden left-0 md:mt-15 h-[calc(100vh-3.5rem)] w-72
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
                      ${pathname === href
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
                      ${isActiveParent
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
                    className={`mt-1 overflow-hidden transition-all duration-300 ${isOpenMenu ? "max-h-[1000px]" : "max-h-0"
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
                            ${activeChild
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
