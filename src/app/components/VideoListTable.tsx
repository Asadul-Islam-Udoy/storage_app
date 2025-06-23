"use client";

import { useState } from "react";
import VideoModal from "../modal/VideoModal";
import DeleteModal from "../modal/DeleteModal";

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  createdAt?: string;
}

interface Props {
  videos: Video[];
}

export default function VideoListTable({ videos }: Props) {
  const [videoShow, setVideoShow] = useState<boolean>(false);
  const [videoDeleteShow, setVideoDeleteShow] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<number | string>("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / rowsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset page
  };

  return (
    <>
      {videoShow && (
        <div>
          <VideoModal
            videoId={videoId}
            videoShow={videoShow}
            setVideoShow={setVideoShow}
          />
        </div>
      )}
      {videoDeleteShow && (
        <div>
          <DeleteModal videoId={videoId} videoDeleteShow={videoDeleteShow} setVideoDeleteShow = {setVideoDeleteShow}/>
        </div>
      )}
      {!videoShow && !videoDeleteShow && (
        <div className="w-full overflow-x-auto bg-gray-400  rounded shadow-md p-4">
          {/* Search and Rows Selector */}
          <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset on search
              }}
              className="w-full md:w-1/3 p-2 border rounded"
            />

            <div className="flex items-center justify-content-center gap-2">
              {/* Pagination */}
              <div className="mt-4  flex justify-end ">
                <button
                  onClick={() => [setVideoShow((pre) => !pre), setVideoId("")]}
                  className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  + Create Video
                </button>
              </div>
              <label className="text-sm font-medium">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleRowsChange}
                className="border p-1 rounded"
              >
                {[5, 10, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Video URL</th>
                <th className="p-2 border">Preview</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVideos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No matching videos found.
                  </td>
                </tr>
              ) : (
                paginatedVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{video.id}</td>
                    <td className="p-2 border">{video.title}</td>
                    <td className="p-2 border">{video.description}</td>
                    <td className="p-2 border break-all">{video.video_url}</td>
                    <td className="p-2 border">
                      {video.video_url ? (
                        <video
                          controls
                          className="w-32 max-h-20 object-cover border rounded"
                        >
                          <source src={video.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <span className="text-gray-400">No Video</span>
                      )}
                    </td>
                    <td className="p-2 border text-xs">
                      {video.createdAt || "N/A"}
                    </td>
                    <td className="p-2 border text-center whitespace-nowrap">
                      <button
                        onClick={() => [
                          setVideoId(video.id),
                          setVideoShow((pre) => !pre),
                        ]}
                        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-2 py-1 rounded mr-2 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => [
                          setVideoId(video.id),
                          setVideoDeleteShow((pre) => !pre),
                        ]}
                        className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
