"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
interface NavbarProps{
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}
const Navbar: React.FC<NavbarProps> = ({isOpen,setIsOpen}) => {
  return (
    <nav className="bg-gray-900 fixed z-50 shadow-lg text-white p-2 w-full">
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
            🎬 Store App
          </Link>
        </div>
        <ul className='mr-10 cursor-pointer'>
          <img className="h-10 w-10 rounded-full" src='https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'  alt="avatar images"/>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
