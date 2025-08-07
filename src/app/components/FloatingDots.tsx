// Floating animated dots background
import { motion,  } from "framer-motion";
function FloatingDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0, 0.2, 0.5, 0.2, 0],
            y: [10, 5, 0, 5, 10],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 8 + Math.random() * 6,
            delay: i * 0.3,
          }}
          className="absolute rounded-full bg-orange-400/30 w-2 h-2"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingDots