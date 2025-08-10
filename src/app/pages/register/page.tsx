"use client";
import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface RegisterProps {}

const Register: FC<RegisterProps> = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userCreateInfo, setUserCreateInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (userCreateInfo.password !== userCreateInfo.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match!");
    }
    const { confirmPassword, ...payload } = userCreateInfo;
    try {
      const res = await fetch("/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('data',data)
      if (!res.ok) {
        setLoading(false);
        return toast.error(data.message || "Something went wrong!");
      }
      toast.success("Registered successfully!");
      setUserCreateInfo({ name: "", email: "", password: "", confirmPassword: "" });
      setLoading(false);
      router.push("/pages/login");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black px-4 sm:px-6">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Create Account
        </h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          {/* Username */}
          <input
            type="text"
            required
            value={userCreateInfo.name}
            onChange={(e) =>
              setUserCreateInfo((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Full Name"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
          />

          {/* Email */}
          <input
            type="email"
            required
            value={userCreateInfo.email}
            onChange={(e) =>
              setUserCreateInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email Address"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={userCreateInfo.password}
              onChange={(e) =>
                setUserCreateInfo((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Password"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={userCreateInfo.confirmPassword}
              onChange={(e) =>
                setUserCreateInfo((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Confirm Password"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {/* Sign in link */}
          <div className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/pages/login" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
