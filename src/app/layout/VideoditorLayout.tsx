"use client";

import { useState } from "react";
import AudioEditor from "@/app/components/AudioEditor";
import VideoEdit2 from "../components/VideoEdit2";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function VideoditorLayout() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="bg-gray-800 min-h-screen">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
        <main className="h-[700px] overflow-scroll scrollbar-hidden mt-2 bg-gray-900 text-gray-100 p-6 flex flex-col md:flex-row items-stretch">
          {/* Video Editor */}
          <section className="w-full md:w-1/2 p-4">
            <VideoEdit2 />
          </section>

          {/* Separator */}
          <div className="w-full md:w-px h-px md:h-auto bg-gray-700 mx-auto"></div>

          {/* Audio Editor */}
          <section className="w-full mt-2 md:mt-0 md:w-1/2 p-4">
            <AudioEditor />
          </section>
        </main>
      </Layout>
    </div>
  );
}
