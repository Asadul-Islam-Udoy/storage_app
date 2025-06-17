"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
interface NavbarProps{
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}
const Navbar: React.FC<NavbarProps> = ({isOpen,setIsOpen}) => {
  return (
    <nav className="bg-gray-900 shadow-lg text-white p-4">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <div className="flex items-center ml-4 cursor-pointer gap-4">
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsOpen(!isOpen)}
            className=" top-2 left-5 z-50 p-2 cursor-pointer hidden md:block rounded-md bg-white text-black shadow-lg backdrop-blur-md hover:bg-gray-400 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="md:hidden ">
            <button onClick={() => setIsOpen(!isOpen)}>☰</button>
          </div>
          <Link href="/" className="text-2xl font-bold">
            🎬 VideoApp
          </Link>
        </div>
        <ul className={`md:flex gap-6 ${isOpen ? "block" : "hidden"} md:block`}>
          {/* leftside   */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
