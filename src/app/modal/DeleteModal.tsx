'use client'

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Video {
  id: number | string;
  title: string;
  description: string;
  video_url: string;
  other_video_url:string,
  createdAt: string;
}

interface DeleteModalProps {
  videoId:number|string,
  videoDeleteShow:boolean,
  setVideoDeleteShow:React.Dispatch<React.SetStateAction<boolean>>
  setVideosData:React.Dispatch<React.SetStateAction<Video[]>>
}

export default function DeleteModal({ videoId ,setVideosData,videoDeleteShow,setVideoDeleteShow }: DeleteModalProps) {
  const [lodding,setLodding] = useState<boolean>(false)
  const [videoData,setVideoData] = useState<Video>();
  useEffect(()=>{
    async function HandlerFunction(videoId:string|number){
     try{
      setLodding(true);
      const res = await fetch(`/api/videos/${videoId}`,{method:'GET',headers:{'Content-Type':'application/json'}});
      const data = await res.json()
      setLodding(false);
      setVideoData(data.video);
      return
     }
     catch(error:any){
      toast.error(error.message);
      setLodding(false);
      return
     }  
    }
    HandlerFunction(videoId)
  },[videoId]);

  ///delete handler
  const handleDelete = async (vidoId:string | number) => {
    try{
       setLodding(true);
       const res = await fetch(`/api/videos/${vidoId}`,{method:'DELETE',headers:{'Content-Type':'application/json'}});
       const data = await res.json();
       if(!res.ok){
        setLodding(false);
        return toast.error(data.message || 'somthing is wrong');
       } 
       setVideosData(data.videos)
       toast.success('video delete successfully!');
       setLodding(false);
       setVideoDeleteShow(false)
    }
    catch(error:any){
      toast.error(error.message);
      setVideoDeleteShow(false);
      setLodding(false);
    }

  }

  return (
    <>
      {videoDeleteShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{videoData?.title}</strong>?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setVideoDeleteShow(false)}
                className="px-4 py-2 cursor-pointer border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={lodding}
                onClick={()=>handleDelete(videoId)}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
