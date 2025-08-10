'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import Navbar from '@/app/components/Navbar';
import UploadVideo from '../components/UploadVideo';
import VideoBox from '../components/VideoBox';
interface Video {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  other_video_url:string;
  userId:number;
  createdAt: string;
}

interface VideoProps {
  videos: Video[];
}
export default function VideoViewLayout({ videos }: VideoProps) {
  const [isOpen, setIsOpen] = useState(true);

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
