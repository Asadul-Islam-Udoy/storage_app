"use client";
import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
interface RegisterProps {}

const Register: FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [userCreateInfo, setUserCreateInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodding(true);
    if (userCreateInfo.password !== userCreateInfo.confirmPassword) {
      return toast.error("password is not match!");
    }
    const { confirmPassword, ...payload } = userCreateInfo;
    try {
      const res = await fetch('/api/users/register/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setLodding(false);
        return toast.error(data.message || "Somthing is wrong!");
      }
      toast.success("Register successfully!");
      setUserCreateInfo({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setLodding(false);
      router.push("/pages/login");
    } catch (error: any) {
      setLodding(false);
      toast.error(error.message || "Register fails");
    }
  };
  return (
    <>
      <div className="grid bg-gray-800 grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex  flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <form onSubmit={submitHandler}>
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="md:w-[500px] w-full ">
                <input
                  type="text"
                  required
                  value={userCreateInfo.name}
                  onChange={(e) =>
                    setUserCreateInfo((pre) => ({
                      ...pre,
                      name: e.target.value,
                    }))
                  }
                  className="md:w-[500px]  w-full pl-3 pr-10 py-4 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Type Username..."
                />
                <input
                  type="email"
                  required
                  value={userCreateInfo.email}
                  onChange={(e) =>
                    setUserCreateInfo((pre) => ({
                      ...pre,
                      email: e.target.value,
                    }))
                  }
                  className="md:w-[500px] mt-1 w-full pl-3 pr-10 py-4 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Type Email..."
                />
                <div className=" relative flex w-full justify-end items-center">
                  <div
                    onClick={() => setShowPassword((pre) => !pre)}
                    className=" absolute pr-2 cursor-pointer "
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}{" "}
                  </div>
                  <input
                    value={userCreateInfo.password}
                    required
                    onChange={(e) =>
                      setUserCreateInfo((pre) => ({
                        ...pre,
                        password: e.target.value,
                      }))
                    }
                    type={showPassword ? "text" : "password"}
                    className="md:w-[500px] mt-1 w-full pl-3 pr-10 py-4 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Type Password..."
                  />
                </div>
                <div className=" relative flex w-full justify-end items-center">
                  <div
                    onClick={() => setShowConfirmPassword((pre) => !pre)}
                    className=" absolute pr-2 cursor-pointer "
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}{" "}
                  </div>
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={userCreateInfo.confirmPassword}
                    onChange={(e) =>
                      setUserCreateInfo((pre) => ({
                        ...pre,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="md:w-[500px] mt-1 w-full pl-3 pr-10 py-4 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Type Confirm Password..."
                  />
                </div>

                <div className=" p-6 ml-[32%] md:ml-[45%]">
                  <p className=" text-white">
                    If you already sinup?{" "}
                    <Link
                      className=" text-blue-500 border-b-2"
                      href="/pages/login"
                    >
                      sign in
                    </Link>
                  </p>
                </div>
                <div className="w-full mt-2 cursor-pointer bg-blue-400 flex justify-content-center align-items-center">
                  <button className="p-2 cursor-pointer text-[red] w-full">
                    {lodding ? "Registering..." : "Register"}
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
export default Register;
