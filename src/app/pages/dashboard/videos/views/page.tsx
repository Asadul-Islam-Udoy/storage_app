
import VideoViewLayout from "@/app/layout/VideoViewLayout";
import { prisma } from "@/lib/prisma";
interface Video {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  other_video_url:string;
  userId:number;
  createdAt: string;
}
async function VideoViews() {
      const videos = await prisma.videos.findMany();
      const normalizedVideos:Video[] = videos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        video_url: `/videos/${video.video}` || '', 
        other_video_url:video?.videoUrl || '',
        userId:video.userId,
        createdAt: video.createdAt?.toISOString() || "",
      }));
  return <VideoViewLayout  videos={normalizedVideos}/>
}

export default VideoViews;
