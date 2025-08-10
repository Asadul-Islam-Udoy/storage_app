// components/LoadingOverlay.tsx
"use client";
import { motion } from "framer-motion";

export default function Loadding() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full"
      />
    </motion.div>
  );
}
