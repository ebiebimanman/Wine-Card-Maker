import { motion } from "framer-motion";

export function CheersAnimation() {
  const leftGlassVariants = {
    initial: { rotate: 0, scale: 1, x: -30 },
    animate: {
      rotate: [0, -20, 25, 0],
      scale: [1, 1.05, 0.9, 1.1, 1],
      x: [-30, -40, 0, 0],
      transition: {
        duration: 1.0,
        times: [0, 0.4, 0.6, 0.8, 1],
        ease: ["easeOut", "anticipate", "easeOut", "easeInOut"],
      },
    },
  };

  const rightGlassVariants = {
    initial: { rotate: 0, scale: 1, x: 30 },
    animate: {
      rotate: [0, 20, -25, 0],
      scale: [1, 1.05, 0.9, 1.1, 1],
      x: [30, 40, 0, 0],
      transition: {
        duration: 1.0,
        times: [0, 0.4, 0.6, 0.8, 1],
        ease: ["easeOut", "anticipate", "easeOut", "easeInOut"],
      },
    },
  };

  const sparkVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.8, 2],
      opacity: [0, 1, 0],
      transition: {
        delay: 0.55, // Adjusted to match the moment of impact (around 0.6s)
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center py-10 overflow-visible h-full w-full">
      <div className="relative flex items-center justify-center w-0 h-0">
        {/* Left Glass */}
        <motion.div
          variants={leftGlassVariants}
          initial="initial"
          animate="animate"
          className="text-7xl select-none absolute right-2 bottom-[-45px]"
          style={{ originX: 0.5, originY: 1 }}
        >
          🍷
        </motion.div>

        {/* Right Glass */}
        <motion.div
          variants={rightGlassVariants}
          initial="initial"
          animate="animate"
          className="text-7xl select-none absolute left-2 bottom-[-45px]"
          style={{ originX: 0.5, originY: 1 }}
        >
          🍷
        </motion.div>

        {/* Sparkle Effect - Centered between glasses */}
        <motion.div
          variants={sparkVariants}
          initial="initial"
          animate="animate"
          className="absolute left-0 top-[-40px] flex items-center justify-center pointer-events-none z-20 w-0 h-0"
        >
          <div className="relative flex items-center justify-center">
            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: [0, (Math.cos((i * 30) * Math.PI / 180) * (60 + Math.random() * 20))],
                  y: [0, (Math.sin((i * 30) * Math.PI / 180) * (60 + Math.random() * 20))],
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0.6]
                }}
                transition={{
                  delay: 0.55,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                {["✨", "🎉", "🔸", "✨", "🔸"][i % 5]}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
