"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

interface VideoInformationProps {
  title: string;
  description: string;
  video: File | string;
  userId: string | number;
}

interface VideoInformation {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  createdAt: string;
}

interface VideoCreateProps {
  videoId: number | string;
  videoShow: boolean;
  setVideoShow: React.Dispatch<React.SetStateAction<boolean>>;
  setVideosData: React.Dispatch<React.SetStateAction<VideoInformation[]>>;
  videosData: VideoInformation[];
}

export default function VideoModal({
  videoId,
  videoShow,
  setVideoShow,
  setVideosData,
  videosData,
}: VideoCreateProps) {
  const userInfo = useUser();
  const [lodding, setLodding] = useState<boolean>(false);
  const [singleVideo, setSingleVideo] = useState<VideoInformation>();
  const [newVideoShow, setNewVideoShow] = useState<string>("");
  const [videoInformation, setVideoInformation] =
    useState<VideoInformationProps>({
      title: "",
      description: "",
      video: "",
      userId: userInfo?.userInfo?.id || "",
    });

  ///select single video data
  useEffect(() => {
    if (videoId) {
      const selectedVideo = videosData.find((item) => item.id === videoId);
      setSingleVideo(selectedVideo);
      if (selectedVideo) {
        setVideoInformation({
          title: selectedVideo.title,
          description: selectedVideo.description,
          video: selectedVideo.video_url,
          userId: userInfo?.userInfo?.id || "",
        });
      } else {
        setVideoInformation({
          title: "",
          description: "",
          video: "",
          userId: userInfo?.userInfo?.id || "",
        });
      }
    }
  }, [videoId, setSingleVideo, userInfo?.userInfo?.id]);

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
    if (file) {
      setVideoInformation((prev) => ({
        ...prev,
        video: file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setNewVideoShow(previewUrl);
    } else {
      setVideoInformation((prev) => ({
        ...prev,
        video: "",
      }));
      setNewVideoShow("");
    }
  };

  ///submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLodding(true);
    const formData = new FormData();
    formData.append("title", videoInformation.title);
    formData.append("description", videoInformation.description);
    formData.append("userId", String(videoInformation.userId));
    if (videoInformation.video instanceof File) {
      formData.append("video", videoInformation.video);
    }
    try {
      const isUpdate = !!videoId;
      const url = isUpdate ? `/api/videos/${videoId}`:'/api/videos'
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setLodding(false);
        console.log(data.message);
        return toast.error(data.message || String(data.message));
      }
      toast.success(isUpdate ?"video update successfully!":"video create successfully!");
      setLodding(false);
      setVideoShow(false);
      const filtering = videosData.filter((item)=>item.id !== data.video.id)
      setVideosData((pre) => [...filtering, data.video]);
      setVideoInformation({
        title: "",
        description: "",
        video: "",
        userId: userInfo?.userInfo?.id || "",
      });
    } catch (err: any) {
      toast.error(err.message || String(err));
      setLodding(false);
    }
  };

  return (
    <>
      {videoShow && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
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
                <label className="block text-sm font-medium">Video</label>
                <input
                  name="video"
                  type="file"
                  className="w-full border rounded p-2"
                  onChange={handleFileChange}
                  required={videoId?false:true}
                />
              </div>
              <div className="flex justify-between space-x-2">
                <div className="flex gap-2">
                  {videoId && (
                    <div className="">
                      <label className="block text-sm font-medium mb-1">
                        Previous
                      </label>
                      <video
                        src={singleVideo?.video_url}
                        controls
                        className=" max-h-20 w-20 rounded border"
                      />
                    </div>
                  )}
                  {videoInformation.video && newVideoShow && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        New
                      </label>
                      <video
                        src={
                          typeof videoInformation.video === "string"
                            ? videoInformation?.video
                            : newVideoShow
                        }
                        controls
                        className=" max-h-20 w-20 rounded border"
                      />
                    </div>
                  )}
                </div>
                <div className="">
                  <button
                    type="button"
                    onClick={() => setVideoShow(false)}
                    className="px-4 mr-1 py-2 cursor-pointer border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={lodding}
                    className="px-4 py-2  cursor-pointer bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {videoId ? "Update" : "Create"}
                    {lodding && "...."}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
