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
  const [showLogout, setShowLogout] = useState<boolean>(false);

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
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
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
          <div className="relative mr-6 cursor-pointer" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-2 focus:outline-none group"
            >
              <Link href='/users/admin_asadul.png'>
                {" "}
                <img
                  className="h-9 w-9 rounded-full border-2 border-orange-400 group-hover:scale-105 transition-transform"
                 src={userInfo?.profile?.image ? `/users/${userInfo?.profile.image}` : "/users/admin_asadul.png"}
                  alt="avatar"
                />
              </Link>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold">{userInfo?.name}</span>
                <span className="text-[11px] italic text-gray-300">
                  {userInfo?.email}
                </span>
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xl border border-white/20
    bg-white/80 backdrop-blur-lg text-gray-800 animate-slide-down"
              >
                <Link
                  href="/settings"
                  className="flex items-center px-5 py-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                >
                  <Settings className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="font-medium">Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogout(true);
                  }}
                  className="w-full flex items-center px-5 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-red-500"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {isOpen && (
        <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
      )}
    </>
  );
};

export default Navbar;
