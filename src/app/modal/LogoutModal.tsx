"use client";
import { LogOut, X } from "lucide-react";
import { useState } from "react";

interface LogoutModalProps {
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ showLogout, setShowLogout }) => {
  if (!showLogout) return null;

  const handleLogoutConfirm = async () => {
    try {
      const res = await fetch("/api/users/logout/", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("authToken");
        window.location.href = "/pages/login?error=unauthorized";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md transform transition-all duration-300 scale-95 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Confirm Logout
          </h2>
          <button
            onClick={() => setShowLogout(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 text-center">
          <LogOut className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Are you sure you want to log out?
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setShowLogout(false)}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLogout(false);
              handleLogoutConfirm();
            }}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
