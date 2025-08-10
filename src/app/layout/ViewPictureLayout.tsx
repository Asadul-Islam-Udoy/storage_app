"use client"
import { useState } from "react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import PicturesView from "../components/PicturesView";
interface Picture {
  id: number | string;
  title: string;
  description: string;
  picture: string;
  pictureUrl:string;
  userId:number;
  createdAt: string;
}

interface PictrueProps {
  pictures: Picture[];
}
function ViewPictureLayout({pictures}:PictrueProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
        <>
        <div className=" bg-gray-800 min-h-screen">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
            <div><PicturesView pictures={pictures}/></div>
          </div>
        </Layout>
      </div>
        </>
       
    )
}

export default ViewPictureLayout
