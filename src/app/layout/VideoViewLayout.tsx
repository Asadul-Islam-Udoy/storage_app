'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import Navbar from '@/app/components/Navbar';
import UploadVideo from '../components/UploadVideo';
import VideoBox from '../components/VideoBox';

export default function VideoViewLayout() {
  const [isOpen, setIsOpen] = useState(true);
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
    <div className="min-h-screen bg-gray-800 w-full">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="mt-15">
          <VideoBox  videos={videos} />
        </div>
      </Layout>
    </div>
  );
}
