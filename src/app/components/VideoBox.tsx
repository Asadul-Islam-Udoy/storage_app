
import React from 'react';
interface VideoBoxProps{
  id?:number,
  title?:string,
  src?:string,
  isEmbed?:boolean
}
interface VideoBoxGridProps {
 videos:VideoBoxProps[]
}

const VideoBox: React.FC<VideoBoxGridProps> = ({ videos }) => {
  return (
   <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {videos.map(({ id, title, src, isEmbed }) => (
        <div key={id} className="rounded-xl shadow-lg overflow-hidden bg-white">
          {title && <h3 className="text-lg font-semibold p-2">{title}</h3>}
          <div className="relative pb-[56.25%] h-0">
            {isEmbed ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={src}
                title={title || 'Video'}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                controls
                className="absolute top-0 left-0 w-full h-full object-cover"
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
