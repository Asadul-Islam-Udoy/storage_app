"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface PictureData {
  id?: number;
  title: string;
  description?: string;
  imageUrl?: string;
}

interface UploadPictureProps {
  existingPicture?: PictureData; // If provided, this is edit mode
  onSuccess?: (data: any) => void;
}

export default function UploadPicture({ existingPicture, onSuccess }: UploadPictureProps) {
  const [title, setTitle] = useState(existingPicture?.title || "");
  const [description, setDescription] = useState(existingPicture?.description || "");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureURL, setPictureURL] = useState(existingPicture?.imageUrl || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingPicture) {
      setTitle(existingPicture.title || "");
      setDescription(existingPicture.description || "");
      setPictureURL(existingPicture.imageUrl || "");
      setPictureFile(null);
    }
  }, [existingPicture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPictureFile(file);
      setPictureURL("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPictureURL(e.target.value);
    setPictureFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || (!pictureFile && !pictureURL)) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (pictureFile) {
        formData.append("picture", pictureFile);
      } else {
        formData.append("pictureUrl", pictureURL);
      }

      const method = existingPicture?.id ? "PATCH" : "POST";
      const url = existingPicture?.id ? `/api/pictures/${existingPicture.id}` : "/api/pictures/";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || "Upload failed");
      }

      toast.success(existingPicture ? "Picture updated successfully!" : "Picture uploaded successfully!");

      if (!existingPicture) {
        // Reset form only for new upload
        setTitle("");
        setDescription("");
        setPictureFile(null);
        setPictureURL("");
      }

      onSuccess?.(data);

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-screen overflow-scroll scrollbar-hidden md:h-[620px] bg-gray-900 text-white rounded-xl shadow-lg p-6 mt-13 space-y-6">
      <h2 className="text-2xl font-bold">{existingPicture ? "Update Picture" : "Upload a Picture"}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
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

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            placeholder="Optional description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Picture Upload and URL Inputs */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full">
            <label className="block mb-2 font-medium">Upload Picture File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            {pictureFile && (
              <p className="mt-1 text-sm text-green-400">Selected file: {pictureFile.name}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2 font-medium">Or paste Image URL</label>
            <input
              type="url"
              value={pictureURL}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Preview */}
        {(pictureFile || pictureURL) && (
          <div className="mt-4">
            <label className="block text-gray-200 font-medium mb-1">Preview</label>
            <img
              src={pictureFile ? URL.createObjectURL(pictureFile) : pictureURL}
              alt="Preview"
              className="w-full max-h-64 rounded-lg border border-gray-300 object-contain"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !title || (!pictureFile && !pictureURL)}
          className="w-full cursor-pointer py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (existingPicture ? "Updating..." : "Uploading...") : existingPicture ? "Update Picture" : "🚀 Upload Picture"}
        </button>
      </form>
    </div>
  );
}
