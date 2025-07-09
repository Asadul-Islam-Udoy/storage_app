"use client"
import AudioEditor from "@/app/components/AudioEditor";
import VideoEditor from "@/app/components/VideoEditor";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Layout from "../components/Layout";

export default function EditorLayout() {
const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className=" bg-gray-800 min-h-screen">
      <div>
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>
          <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col md:flex-row items-stretch">
            <div className="w-full md:w-1/2 p-4">
              <VideoEditor />
            </div>

            {/* Separator */}
            <div className="w-full md:w-px h-px md:h-auto bg-gray-700 mx-auto"></div>

            <div className="w-full md:w-1/2 p-4">
              <AudioEditor />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
