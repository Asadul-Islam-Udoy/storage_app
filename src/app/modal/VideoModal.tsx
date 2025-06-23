"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "../context/UserContext";

interface VideoCreateProps {
  videoId: number | string;
  videoShow: boolean;
  setVideoShow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface VideoInformationProps {
  title: string;
  description: string;
  video: File | string;
  userId: string | number;
}

export default function VideoModal({
  videoId,
  videoShow,
  setVideoShow,
}: VideoCreateProps) {
  const userInfo = useUser();
  const [videoInformation, setVideoInformation] =
    useState<VideoInformationProps>({
      title: "",
      description: "",
      video: "",
      userId: "",
    });

  // Handle input and textarea changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVideoInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || "";
    setVideoInformation((prev) => ({
      ...prev,
      video: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted Video Info:", videoInformation);
    setVideoShow(false);

    // Optionally use FormData to submit if video is a file
    // const formData = new FormData();
    // formData.append("title", videoInformation.title);
    // formData.append("description", videoInformation.description);
    // formData.append("userId", String(videoInformation.userId));
    // if (videoInformation.video instanceof File) {
    //   formData.append("video", videoInformation.video);
    // }
    // await fetch("/api/videos", { method: "POST", body: formData });
  };

  return (
    <>
      {videoShow && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {JSON.stringify(userInfo)}
              {videoId ? "Update Video" : "Create Video"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  name="title"
                  type="text"
                  className="w-full border rounded p-2"
                  value={videoInformation.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  className="w-full border rounded p-2"
                  value={videoInformation.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">User ID</label>
                <input
                  name="userId"
                  type="text"
                  className="w-full border rounded p-2"
                  value={videoInformation.userId}
                  onChange={handleChange}
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
                  {videoId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
