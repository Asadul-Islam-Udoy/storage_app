"use client"
import { useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import ViewOthersFile from "../components/ViewOthersFile";
interface OthersFile {
  id: number | string;
  title: string;
  description: string;
  file: string;
  fileUrl:string;
  userId:number;
  createdAt: string;
}

interface OthersProps {
  otherfiles: OthersFile[];
}
function ViewOthersLayout({otherfiles}:OthersProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className=" bg-gray-800  ">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
           <ViewOthersFile otherfiles={otherfiles}/>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default ViewOthersLayout;