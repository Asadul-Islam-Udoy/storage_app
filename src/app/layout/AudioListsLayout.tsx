"use client"
import { useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import AudioLists from "../components/AudioLists";

function AudioListsLayout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className=" bg-gray-800  ">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
           <AudioLists/>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default AudioListsLayout;
