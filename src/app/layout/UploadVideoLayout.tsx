'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import Navbar from '@/app/components/Navbar';
import UploadVideo from '../components/UploadVideo';

export default function UploadVideoLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-800 w-full">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="mt-15">
          <UploadVideo/>
        </div>
      </Layout>
    </div>
  );
}
