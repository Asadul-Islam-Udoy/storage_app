'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import Navbar from '@/app/components/Navbar';
import VideoListTable from '@/app/components/VideoListTable';

const initialVideos = [
  {
    id: 1,
    title: 'Asadul',
    description: 'Sample description 1',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    createdAt: '2024-06-01',
  },
  {
    id: 2,
    title: 'John',
    description: 'Sample description 2',
    video_url: 'https://www.w3schools.com/html/movie.mp4',
    createdAt: '2024-06-10',
  },
  {
    id: 3,
    title: 'Jane',
    description: 'Sample description 3',
    video_url: '',
    createdAt: '2024-06-15',
  },
];

export default function ListsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState(initialVideos);





  return (
    <div className="min-h-screen bg-gray-800 w-full">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="mt-15">
          <VideoListTable
            videos={videos}
          />
        </div>
      </Layout>
    </div>
  );
}
