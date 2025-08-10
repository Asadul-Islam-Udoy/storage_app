"use client";

import { useState } from "react";
import VideoModal from "../modal/VideoModal";
import DeleteModal from "../modal/DeleteModal";

interface Video {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  other_video_url: string;
  createdAt: string;
}

interface VideoProps {
  videos: Video[];
}

export default function VideoListTable({ videos }: VideoProps) {
  const [videoShow, setVideoShow] = useState(false);
  const [videoDeleteShow, setVideoDeleteShow] = useState(false);
  const [videosData, setVideosData] = useState(videos);
  const [videoId, setVideoId] = useState<number | string>("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredVideos = videosData.filter(
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
    setCurrentPage(1);
  };

  return (
    <>
      {videoShow && (
        <VideoModal
          videoId={videoId}
          videoShow={videoShow}
          setVideoShow={setVideoShow}
          setVideosData={setVideosData}
          videosData={videosData}
        />
      )}
      {videoDeleteShow && (
        <DeleteModal
          setVideosData={setVideosData}
          videoId={videoId}
          videoDeleteShow={videoDeleteShow}
          setVideoDeleteShow={setVideoDeleteShow}
        />
      )}

      {!videoShow && !videoDeleteShow && (
        <div className="w-full overflow-x-auto bg-gray-800 text-white rounded shadow-md p-4">
          {/* Search and Controls */}
          <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-1/3 p-2 border border-gray-500 rounded bg-gray-700 text-white"
            />

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleRowsChange}
                className="border border-gray-500 bg-gray-700 text-white p-1 rounded"
              >
                {[5, 10, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table: Desktop */}
          <div className="hidden md:block">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-2 border border-gray-600">ID</th>
                  <th className="p-2 border border-gray-600">Title</th>
                  <th className="p-2 border border-gray-600">Description</th>
                  <th className="p-2 border border-gray-600">Video URL</th>
                  <th className="p-2 border border-gray-600">Other Video URL</th>
                  <th className="p-2 border border-gray-600">Preview</th>
                  <th className="p-2 border border-gray-600">Created At</th>
                  <th className="p-2 border border-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVideos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-400">
                      No matching videos found.
                    </td>
                  </tr>
                ) : (
                  paginatedVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-700">
                      <td className="p-2 border border-gray-600">{video.id}</td>
                      <td className="p-2 border border-gray-600">{video.title}</td>
                      <td className="p-2 border border-gray-600">{video.description}</td>
                      <td className="p-2 border border-gray-600 break-all">{video.video_url}</td>
                      <td className="p-2 border border-gray-600 break-all">{video.other_video_url}</td>
                      <td className="p-2 border border-gray-600">
                        {video.video_url ? (
                          <video controls className="w-32 max-h-20 object-cover border rounded">
                            <source src={video.video_url} type="video/mp4" />
                          </video>
                        ) : (
                          <span className="text-gray-400">No Video</span>
                        )}
                      </td>
                      <td className="p-2 border border-gray-600 text-xs">{video.createdAt}</td>
                      <td className="p-2 border border-gray-600 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            setVideoId(video.id);
                            setVideoShow(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setVideoId(video.id);
                            setVideoDeleteShow(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card Layout */}
          <div className="block md:hidden space-y-4">
            {paginatedVideos.length === 0 ? (
              <p className="text-center text-gray-400">No matching videos found.</p>
            ) : (
              paginatedVideos.map((video) => (
                <div
                  key={video.id}
                  className="border border-gray-600 rounded p-3 bg-gray-700 space-y-2"
                >
                  <div className="text-sm">
                    <strong>Title:</strong> {video.title}
                  </div>
                  <div className="text-sm">
                    <strong>Description:</strong> {video.description}
                  </div>
                  <div className="text-sm break-all">
                    <strong>Video URL:</strong> {video.video_url}
                  </div>
                  <div className="text-sm break-all">
                    <strong>Other URL:</strong> {video.other_video_url}
                  </div>
                  <div>
                    {video.video_url ? (
                      <video controls className="w-full max-h-48 rounded">
                        <source src={video.video_url} type="video/mp4" />
                      </video>
                    ) : (
                      <span className="text-gray-400">No Video</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-300">
                    Uploaded: {video.createdAt}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setVideoId(video.id);
                        setVideoShow(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setVideoId(video.id);
                        setVideoDeleteShow(true);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
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
