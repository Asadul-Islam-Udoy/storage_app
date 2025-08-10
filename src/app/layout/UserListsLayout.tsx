"use client"
import { useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import UserListsTable from "../components/UserListsTable";
import { Audios, Others_File, Pictures, Profile, Videos } from "@prisma/client";
interface User {
  id: number | string;
  name: string;
  email: string;
  videos: Videos[];       // array of Videos
  audios: Audios[];       // array of Audios
  pictures: Pictures[];   // array of Pictures
  othersFile: Others_File[]; // array of Others_File
  profile: Profile | null;
  createdAt: string;
}

interface UserProps {
  users: User[];
}
function UserListLayout({users}:UserProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className=" bg-gray-800  ">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
            <UserListsTable users={users}/>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default UserListLayout;
