import React, { useState, useMemo } from "react";
import { Play } from "lucide-react";

interface Video {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  other_video_url: string;
  userId: number;
  createdAt: string;
}

interface VideoProps {
  videos: Video[];
}

const VideoBox: React.FC<VideoProps> = ({ videos }) => {
  const [search, setSearch] = useState("");

  const isValidVideoUrl = (url: string) => {
    return url && /\.(mp4|webm|ogg)$/i.test(url);
  };

  const getVideoType = (url: string) => {
    if (url.endsWith(".mp4")) return "video/mp4";
    if (url.endsWith(".webm")) return "video/webm";
    if (url.endsWith(".ogg")) return "video/ogg";
    return "video/mp4";
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;
    const lowerSearch = search.toLowerCase();
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(lowerSearch) ||
        v.description.toLowerCase().includes(lowerSearch)
    );
  }, [search, videos]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="search"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full max-w-md mx-auto
            rounded-full
            border border-indigo-300
            px-5 py-3
            text-white
            placeholder-gray-400
            shadow-lg
            focus:outline-none focus:ring-4 focus:ring-indigo-400
            transition
            duration-300
            hover:shadow-indigo-500
            "
          aria-label="Search videos"
        />
      </div>

      {/* Video Grid */}
      <div className="grid gap-8 sm:gap-10 max-h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-100 p-2 sm:p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full mt-20 text-lg font-medium">
            No videos found.
          </p>
        ) : (
          filteredVideos.map(({ id, title, video_url, other_video_url }) => {
            const src = isValidVideoUrl(video_url) ? video_url : other_video_url;
            const isEmbed = src.includes("youtube") || src.includes("vimeo");
            const iframeSrc = isEmbed ? getEmbedUrl(src) : src;

            return (
              <div
                key={id}
                className="
                  group
                  rounded-3xl
                  bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-950
                  shadow-2xl
                  border
                  border-indigo-700/50
                  overflow-hidden
                  hover:shadow-indigo-700/70
                  hover:scale-[1.03]
                  transition-transform
                  duration-300
                "
              >
                {/* Title bar */}
                {title && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4">
                    <Play className="w-6 h-6 text-yellow-400 group-hover:scale-125 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white truncate">{title}</h3>
                  </div>
                )}

                {/* Video Container */}
                <div className="relative aspect-video bg-black">
                  {isEmbed ? (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-b-3xl"
                      src={iframeSrc}
                      title={title || "Video"}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-b-3xl"
                      preload="metadata"
                    >
                      <source src={src} type={getVideoType(src)} />
                      Your browser does not support HTML5 video.
                    </video>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VideoBox;
