"use client"
import { useState } from "react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import PicturesView from "../components/PicturesView";
<<<<<<< HEAD
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
=======
function ViewPictureLayout() {
>>>>>>> bcb973c1298360509b00b8f277141b3965292bc9
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
        <>
        <div className=" bg-gray-800 min-h-screen">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
<<<<<<< HEAD
            <div><PicturesView pictures={pictures}/></div>
=======
            <div><PicturesView/></div>
>>>>>>> bcb973c1298360509b00b8f277141b3965292bc9
          </div>
        </Layout>
      </div>
        </>
       
    )
}

export default ViewPictureLayout
