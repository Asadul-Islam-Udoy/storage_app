"use client";
import Link from "next/link";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useEffect, useRef, useState } from "react";
import LogoutModal from "../modal/LogoutModal";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const { userInfo, setUserInfo } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 fixed z-50 shadow-lg text-white p-3 w-full">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center ml-4 gap-4">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setIsOpen(!isOpen)}
              className="hidden md:block p-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-2xl font-bold"
              >
                ☰
              </button>
            </div>
            <Link href="/" className="text-2xl font-extrabold text-orange-400">
              🎬 Storage App
            </Link>
          </div>

          {/* Right Section */}
          <div className="relative mr-6" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <img
                className="h-9 w-9 rounded-full border-2 border-orange-400 group-hover:scale-105 transition-transform"
                src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                alt="avatar"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold">{userInfo?.name}</span>
                <span className="text-[11px] italic text-gray-300">
                  {userInfo?.email}
                </span>
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2 text-gray-600" /> Settings
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsOpen(true);
                  }}
                  className="w-full text-left flex items-center px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {isOpen && (
         <LogoutModal isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </>
  );
};

export default Navbar;
