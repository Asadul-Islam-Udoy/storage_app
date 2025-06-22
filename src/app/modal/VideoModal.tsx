"use client";

import { useState } from "react";
interface VideoCreateProps {
  videoId: number | string;
  videoShow: boolean;
  setVideoShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function VideoModal({
  videoId,
  videoShow,
  setVideoShow,
}: VideoCreateProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit form to API
    console.log({ title, description, videoUrl });
    setVideoShow(false);
  };


  const handleEdit = (id: number) => {
    // alert(`Edit video with ID: ${id}`);
  };

  return (
    <>
      {videoShow && (
        <>
          {videoId ? (
            <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Create Video</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Video URL
                    </label>
                    <input
                      type="url"
                      className="w-full border rounded p-2"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setVideoShow(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Create Video</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Video URL
                    </label>
                    <input
                      type="url"
                      className="w-full border rounded p-2"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setVideoShow(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
