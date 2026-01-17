import { motion } from "framer-motion";

interface CheersAnimationProps {
  wineType?: 'red' | 'white' | 'rose' | 'other';
}

export function CheersAnimation({ wineType = 'red' }: CheersAnimationProps) {
  const effectColorClass = 
    wineType === 'white' ? 'bg-amber-300' : 
    wineType === 'rose' ? 'bg-pink-300' :
    wineType === 'other' ? 'bg-indigo-300' :
    'bg-rose-400';

  const leftGlassVariants = {
    initial: { rotate: 0, scale: 1, x: -30 },
    animate: {
      rotate: [0, -10, 15, 15, 0], // Wind-up, impact, linger, return
      x: [-30, -35, -5, -5, -30],
      transition: {
        duration: 1.2, // Shortened from 1.5s
        times: [0, 0.15, 0.35, 0.7, 1], // Wind-up shortened to 0.15s
        ease: "easeInOut",
      },
    },
  };

  const rightGlassVariants = {
    initial: { rotate: 0, scale: 1, x: 30 },
    animate: {
      rotate: [0, 10, -15, -15, 0],
      x: [30, 35, 5, 5, 30],
      transition: {
        duration: 1.2,
        times: [0, 0.15, 0.35, 0.7, 1],
        ease: "easeInOut",
      },
    },
  };

  const sparkVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 0.8],
      opacity: [0, 1, 0],
      transition: {
        delay: 0.35, // Sync with impact
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const getEmoji = () => {
    switch(wineType) {
      case 'white': return '🥂';
      case 'rose': return '🍷'; // Use wine glass for rose too
      case 'other': return '🍹';
      default: return '🍷';
    }
  };

  const emoji = getEmoji();

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
          {emoji}
        </motion.div>

        {/* Right Glass */}
        <motion.div
          variants={rightGlassVariants}
          initial="initial"
          animate="animate"
          className="text-7xl select-none absolute left-2 bottom-[-45px]"
          style={{ originX: 0.5, originY: 1 }}
        >
          {emoji}
        </motion.div>

        {/* Particle Effect */}
        <motion.div
          variants={sparkVariants}
          initial="initial"
          animate="animate"
          className="absolute left-0 top-[-40px] flex items-center justify-center pointer-events-none z-20 w-0 h-0"
        >
          <div className="relative flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${i % 2 === 0 ? 'rounded-sm' : 'rounded-full'} ${effectColorClass}`}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: [0, (Math.cos((i * 72) * Math.PI / 180) * 40)],
                  y: [0, (Math.sin((i * 72) * Math.PI / 180) * 40) - 10],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  rotate: [0, 180]
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
