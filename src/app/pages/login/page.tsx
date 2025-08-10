"use client";

import { useState, type FC } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import { useUser } from "@/app/context/UserContext";
import { signIn } from "next-auth/react";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const router = useRouter();
  const { setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [userLoginInfo, setUserLoginInfo] = useState({
    email: "",
    password: "",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userLoginInfo),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || "Something went wrong!");
      }
      toast.success("Login successful!");
      setUserInfo(data.user);
      setUserLoginInfo({ email: "", password: "" });
      setLoading(false);
      router.push("/dashboard");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Login failed");
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-tr from-blue-900 via-gray-900 to-black px-6 sm:px-12">
      <main className="mx-auto w-full max-w-md rounded-xl bg-gray-900/80 backdrop-blur-md p-10 shadow-2xl text-white">
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-tight text-orange-400 drop-shadow-lg">
          Welcome Back
        </h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <input
            type="email"
            required
            value={userLoginInfo.email}
            onChange={(e) =>
              setUserLoginInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email address"
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
          />
          <input
            type="password"
            required
            value={userLoginInfo.password}
            onChange={(e) =>
              setUserLoginInfo((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="Password"
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
          />

          <div className="flex justify-between items-center text-sm text-gray-400">
            <p>
              Don't have an account?{" "}
              <Link
                href="/pages/register"
                className="text-orange-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/pages/forget-password"
              className="flex items-center gap-1 text-orange-400 hover:underline"
            >
              <KeyOffIcon fontSize="small" />
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 py-3 font-semibold text-gray-900 shadow-lg hover:from-yellow-400 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6 gap-4">
          <hr className="flex-grow border-gray-600" />
          <span className="text-gray-400 font-semibold">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-700 bg-gray-800 py-3 text-white font-semibold hover:bg-gray-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
            className="w-6 h-6"
          >
            <path
              fill="#4285f4"
              d="M533.5 278.4c0-17.7-1.5-34.8-4.3-51.4H272v97.3h146.9c-6.3 34.1-25.2 62.9-53.6 82.3v68h86.5c50.5-46.5 79.7-115.3 79.7-196.2z"
            />
            <path
              fill="#34a853"
              d="M272 544.3c72.6 0 133.6-24 178.2-65.3l-86.5-68c-24.2 16.3-55 25.9-91.7 25.9-70.6 0-130.5-47.7-152-111.4h-89.9v69.7c44.3 87 134.9 149.1 241.9 149.1z"
            />
            <path
              fill="#fbbc04"
              d="M120 326.5c-10.6-31.8-10.6-66.4 0-98.2v-69.7H30.1C10.7 201.2 0 238.1 0 278.4s10.7 77.2 30.1 102.8l89.9-54.7z"
            />
            <path
              fill="#ea4335"
              d="M272 107.7c39.4 0 74.7 13.5 102.5 40.3l76.8-76.8C402.9 24.3 343 0 272 0 165 0 74.3 62.1 30.1 149.1l89.9 69.7c21.5-63.7 81.4-111.1 152-111.1z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Go to Home Button */}
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-full border border-orange-400 text-orange-400 py-3 font-semibold hover:bg-orange-400 hover:text-gray-900 transition"
        >
          Go to Home
        </button>
      </main>
    </div>
  );
};

export default Login;
