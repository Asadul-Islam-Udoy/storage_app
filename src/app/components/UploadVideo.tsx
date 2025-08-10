"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UploadVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoURL, setVideoURL] = useState("");
    const [lodding, setLodding] = useState<boolean>(false);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            setVideoFile(file);
            setVideoURL("");
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoURL(e.target.value);
        setVideoFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || (!videoFile && !videoURL)) {
            alert("Please fill in required fields.");
            return;
        }

        setLodding(true);  // set loading true when starting

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            if (videoFile) {
                formData.append("video", videoFile);
            } else {
                formData.append("videoUrl", videoURL);
            }

            const res = await fetch("/api/videos/", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setLodding(false);
                return toast.error(data.message || "Upload failed");
            }

            toast.success("Video uploaded successfully!");

            // reset form states if you want:
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setVideoURL("");

        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLodding(false);
        }
    };


    function convertToEmbedUrl(url: string): string {
        try {
            const youtubeMatch = url.match(
                /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
            );
            const shortMatch = url.match(
                /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/
            );

            const videoId = youtubeMatch?.[1] || shortMatch?.[1];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            return url; // fallback (not YouTube)
        } catch {
            return url;
        }
    }


    return (
        <div className="max-w-2xl md:h-[600px] overflow-scroll scrollbar-hidden mx-auto bg-gray-900 text-white rounded-xl shadow-lg p-6 mt-10 space-y-6">
            <h2 className="text-2xl font-bold">Upload a Video</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        placeholder="Optional description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="w-full">
                        <label className="block mb-2 font-medium">Upload Video File</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                        />
                    </div>

                    <div className="w-full">
                        <label className="block mb-2 font-medium">
                            Or paste YouTube URL
                        </label>
                        <input
                            type="url"
                            value={videoURL}
                            onChange={handleUrlChange}
                            placeholder="https://youtube.com/..."
                            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                {(videoFile || videoURL) && (
                    <div className="mt-4">
                        <label className="block text-gray-200 font-medium mb-1">
                            Preview
                        </label>

                        {videoFile ? (
                            <video
                                src={URL.createObjectURL(videoFile)}
                                controls
                                className="w-full max-h-64 rounded-lg border border-gray-300"
                            />
                        ) : (
                            <iframe
                                src={convertToEmbedUrl(videoURL)}
                                title="YouTube Preview"
                                className="w-full aspect-video rounded-lg border border-gray-300"
                                allowFullScreen
                            />
                        )}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={lodding || !title || (!videoFile && !videoURL)}
                    className="w-full cursor-pointer py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {lodding ? "Uploading..." : "🚀 Upload Video"}
                </button>
            </form>
        </div>
    );
}
