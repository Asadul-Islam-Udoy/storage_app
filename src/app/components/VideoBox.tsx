import React from "react";
import { Play } from "lucide-react";

interface VideoBoxProps {
  id?: number;
  title?: string;
  src?: string;
  isEmbed?: boolean;
}

interface VideoBoxGridProps {
  videos: VideoBoxProps[];
}

const VideoBox: React.FC<VideoBoxGridProps> = ({ videos }) => {
  return (
    <div className="grid gap-8 md:h-[700px] overflow-scroll scrollbar-hidden  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-14 p-6">
      {videos.map(({ id, title, src, isEmbed }) => (
        <div
          key={id}
          className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 shadow-xl overflow-hidden border border-indigo-600/40 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-transform duration-300"
        >
          {/* Title */}
          {title && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-700 to-indigo-600 px-4 py-3">
              <Play className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
            </div>
          )}

          {/* Video Container */}
          <div className="relative pb-[56.25%] h-0 bg-black">
            {isEmbed ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-b-2xl"
                src={src}
                title={title || "Video"}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                controls
                className="absolute top-0 left-0 w-full h-full object-cover rounded-b-2xl"
              >
                <source src={src} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoBox;
