"use client"
import Layout from "@/app/components/Layout";
import Navbar from "@/app/components/Navbar";
import VideoBox from "@/app/components/VideoBox";

import { useState } from "react";


function VideoViews() {
  const [isOpen, setIsOpen] = useState(false);
  const videos = [
    {
      id: 1,
      title: "Intro to Next.js",
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isEmbed: true,
    },
    {
      id: 2,
      title: "Project Demo",
      src: "/videos/demo.mp4", // stored in public/videos/
      isEmbed: false,
    },
    {
      id: 3,
      title: "Another Tutorial",
      src: "https://www.youtube.com/embed/ysz5S6PUM-U",
      isEmbed: true,
    },
    {
      id: 4,
      title: "Another Tutorial",
      src: "https://www.youtube.com/embed/ysz5S6PUM-U",
      isEmbed: true,
    },

    {
      id: 5,
      title: "Another Tutorial",
      src: "https://www.youtube.com/embed/ysz5S6PUM-U",
      isEmbed: true,
    },
  ];
  return (
    <>
      <div className=" bg-gray-800 min-h-screen">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
            <VideoBox  videos={videos} />
          </div>
        </Layout>
      </div>
    </>
  );
}

export default VideoViews;
