"use client"
import { useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import ProfileEdit from "../components/ProfileEdit";

function ProfileEditLayout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className=" bg-gray-800  ">
        <div>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
           <ProfileEdit/>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default ProfileEditLayout;
