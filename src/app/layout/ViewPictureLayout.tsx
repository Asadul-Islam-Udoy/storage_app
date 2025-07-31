"use client"
import { useState } from "react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import PictruesView from "../components/PictrueView";
function ViewPictureLayout() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <>
        <div className=" bg-gray-800 min-h-screen">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
            <div><PictruesView/></div>
          </div>
        </Layout>
      </div>
        </>
       
    )
}

export default ViewPictureLayout
