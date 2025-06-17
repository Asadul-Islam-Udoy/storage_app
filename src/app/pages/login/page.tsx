"use client";
import { useState, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { useUser } from "@/app/context/UserContext";

interface LoginProps {

}

const Login: FC<LoginProps> = ({}) => {
    const router = useRouter();
      const [lodding, setLodding] = useState<boolean>(false);
      const {setUserInfo} = useUser()
      const [userLoginInfo, setUserLoginInfo] = useState({
        email: "",
        password: "",
      });
    
      const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLodding(true);
        try {
          const res = await fetch('/api/users/login/', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userLoginInfo),
          });
    
          const data = await res.json();
          if (!res.ok) {
            setLodding(false);
            return toast.error(data.message || "Somthing is wrong!");
          }
          toast.success("Login successfully!");
          setUserInfo(data)
          setUserLoginInfo({
            email: "",
            password: "",
          });
          setLodding(false);
          router.push("/");
        } catch (error: any) {
          setLodding(false);
          toast.error(error.message || "Login fails");
        }
      };
  return (
    <>
      <div className="grid bg-gray-800  grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex  flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <img
            className="dark:invert"
            src="https://e7.pngegg.com/pngimages/59/171/png-clipart-video-logo-font-text-play-video-text-logo.png"
            alt="sdf.js logo"
            width={180}
            height={38}
          />
          <form onSubmit={submitHandler}>
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="md:w-[500px] w-full ">
                <input
                  type="text"
                  required
                  value={userLoginInfo.email}
                  onChange={(e)=>setUserLoginInfo((pre)=>({...pre,email:e.target.value}))}
                  className="md:w-[500px]  w-full pl-3 pr-10 py-4 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Type Email..."
                />
                <input
                  value={userLoginInfo.password}
                  onChange={(e)=>setUserLoginInfo((pre)=>({...pre,password:e.target.value}))}
                  type="password"
                  required
                  className="md:w-[500px] mt-1 w-full pl-3 pr-10 py-4 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Type Password..."
                />
                <div className=" p-6 ml-[50%] md:ml-[60%]">
                  <p className=" text-white">
                    If you don't{" "}
                    <Link className=" border-b-2 text-blue-500" href="/pages/register">
                      sign up
                    </Link>
                  </p>
                </div>
                <div className=" p-6">
                  <p className=" text-blue-400 italic font-normal">
                   <KeyOffIcon/> forget{" "}
                    <Link  href="/pages/forget-password">
                      password
                    </Link>
                  </p>
                </div>
                <div className="w-full mt-2 cursor-pointer bg-blue-400 flex justify-content-center align-items-center">
                  <button className="p-2 cursor-pointer text-[red] w-full">
                    {lodding ? "Login..." : "Login"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};
export default Login;
