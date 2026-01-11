import { motion } from "framer-motion";

export function CheersAnimation() {
  const leftGlassVariants = {
    initial: { rotate: 0, scale: 1, x: -20 },
    animate: {
      rotate: [0, -10, 25, 0], // Tilt back (wind-up), clink forward, then reset
      scale: [1, 1, 0.85, 1.15, 1], // Impact bounce (stretch and squash)
      x: [-20, -25, 0, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.2, 0.5, 1],
        ease: "easeInOut",
      },
    },
  };

  const rightGlassVariants = {
    initial: { rotate: 0, scale: 1, x: 20 },
    animate: {
      rotate: [0, 10, -25, 0], // Tilt back (wind-up), clink forward, then reset
      scale: [1, 1, 0.85, 1.15, 1], // Impact bounce (stretch and squash)
      x: [20, 25, 0, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.2, 0.5, 1],
        ease: "easeInOut",
      },
    },
  };

  const sparkVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.5, 2],
      opacity: [0, 1, 0],
      transition: {
        delay: 0.4, // Sync with clink moment (around 0.5 * 0.8s)
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center gap-4 py-8 overflow-visible">
      <div className="relative flex items-center justify-center">
        {/* Left Glass */}
        <motion.div
          variants={leftGlassVariants}
          initial="initial"
          animate="animate"
          className="text-7xl select-none relative z-10"
          style={{ originX: 0.5, originY: 1 }}
        >
          🍷
        </motion.div>

        {/* Right Glass */}
        <motion.div
          variants={rightGlassVariants}
          initial="initial"
          animate="animate"
          className="text-7xl select-none relative z-10"
          style={{ originX: 0.5, originY: 1 }}
        >
          🍷
        </motion.div>

        {/* Sparkle Effect */}
        <motion.div
          variants={sparkVariants}
          initial="initial"
          animate="animate"
          className="absolute left-0 top-0 flex items-center justify-center pointer-events-none z-20"
        >
          <div className="relative">
            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: [0, (Math.cos((i * 45) * Math.PI / 180) * 50)],
                  y: [0, (Math.sin((i * 45) * Math.PI / 180) * 50) - 20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5]
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                {["✨", "🎉", "🔸", "✨"][i % 4]}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
