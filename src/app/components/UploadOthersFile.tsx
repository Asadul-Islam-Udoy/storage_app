"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UploadPdf() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUrl("");
    } else {
      toast.error("Please upload a valid PDF file");
      setPdfFile(null);
      e.target.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfUrl(e.target.value);
    setPdfFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || (!pdfFile && !pdfUrl)) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (pdfFile) {
        formData.append("file", pdfFile);
      } else if (pdfUrl) {
        formData.append("fileUrl", pdfUrl);
      }

      const res = await fetch("/api/othersfile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Upload failed");
        setLoading(false);
        return;
      }

      toast.success("PDF uploaded successfully!");
      setTitle("");
      setDescription("");
      setPdfFile(null);
      setPdfUrl("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl md:h-[600px] overflow-scroll h-screen scrollbar-hidden mx-auto bg-gray-900 text-white rounded-xl shadow-lg p-6 mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Upload a PDF</h2>

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
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
          {pdfFile && (
            <p className="mt-2 text-sm text-indigo-300 truncate">{pdfFile.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Or paste PDF URL</label>
          <input
            type="url"
            value={pdfUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/file.pdf"
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title || (!pdfFile && !pdfUrl)}
          className="w-full cursor-pointer py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "🚀 Upload PDF"}
        </button>
      </form>
    </div>
  );
}
