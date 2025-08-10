"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

interface VideoInformationProps {
  title: string;
  description: string;
  userId: string | number;
}

interface VideoCreateProps {
  videoFileName: string;
  videoShow: boolean;
  setVideoShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VideoSaveModal({
  videoShow,
  setVideoShow,
  videoFileName,
}: VideoCreateProps) {
  const userInfo = useUser();
  const [lodding, setLodding] = useState<boolean>(false);
  const [videoInformation, setVideoInformation] =
    useState<VideoInformationProps>({
      title: "",
      description: "",
      userId: userInfo?.userInfo?.id || "",
    });

  useEffect(() => {
    setVideoInformation((prev) => ({
      ...prev,
      video: videoFileName,
      userId: userInfo?.userInfo?.id || "",
    }));
  }, [videoFileName, userInfo?.userInfo?.id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVideoInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLodding(true);
    if(!videoFileName) return toast.error('No processed video to save!')
    const response = await fetch(videoFileName);
    const blob = await response.blob();
    const file = new File([blob],`edited_${Date.now()}.mp4`,{type:"video/mp4"});

    const formData = new FormData();
    formData.append("title", videoInformation.title);
    formData.append("description", videoInformation.description);
    formData.append("userId", String(videoInformation.userId));
    formData.append("video", file);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setLodding(false);
        return toast.error(data.message || "Failed to save video");
      }

      toast.success("Video created successfully!");
      setLodding(false);
      setVideoShow(false);
      setVideoInformation({
        title: "",
        description: "",
        userId: userInfo?.userInfo?.id || "",
      });
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setLodding(false);
    }
  };

  return (
    <>
      {videoShow && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
              Save Video
            </h2>

            <video
              src={typeof videoFileName === "string" ? videoFileName : ""}
              controls
              className="w-full max-h-60 rounded border mb-4 object-contain"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  value={videoInformation.title}
                  onChange={handleChange}
                  required
                  className="w-full border text-black rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={videoInformation.description}
                  onChange={handleChange}
                  required
                  className="w-full border text-black rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex cursor-pointer flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVideoShow(false)}
                  className="px-4 cursor-pointer py-2 w-full sm:w-auto border rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={lodding}
                  className="px-4 py-2 cursor-pointer w-full sm:w-auto bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {lodding ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
