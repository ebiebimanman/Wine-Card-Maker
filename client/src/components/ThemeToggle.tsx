import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  theme: "red" | "white";
  onThemeChange: (theme: "red" | "white") => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeChange = (newTheme: "red" | "white") => {
    if (isAnimating) return;
    setIsAnimating(true);
    onThemeChange(newTheme);
    setTimeout(() => setIsAnimating(false), 1600); // Total duration of complex animation
  };

  const cheersVariants = {
    initial: { opacity: 0 },
    cheers: {
      opacity: [0, 1, 1, 0],
      transition: {
        times: [0, 0.125, 0.75, 1], // 0.2s fade in, stay until 1.2s, 0.2s fade out
        duration: 1.6,
      }
    }
  };

  const glassLeftVariants = {
    initial: { x: 0, scale: 0, opacity: 0 },
    cheers: {
      x: [0, 0, -10, 0, 0],
      scale: [0, 1.5, 1.5, 1.5, 0],
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 1.6,
        times: [0, 0.125, 0.75, 0.875, 1], // Appear 0.2s, Stay, Clink at 1.2s, Disappear 1.4-1.6s
      }
    }
  };

  const glassRightVariants = {
    initial: { x: 50, scale: 0, opacity: 0 },
    cheers: {
      x: [50, 50, 10, 0, 0],
      scale: [0, 1.5, 1.5, 1.5, 0],
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 1.6,
        times: [0, 0.125, 0.75, 0.875, 1],
      }
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center p-4">
      <motion.button
        type="button"
        onClick={() => handleThemeChange("red")}
        whileTap={{ scale: 0.8 }}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-500 w-28 h-24 overflow-visible",
          theme === "red" 
            ? "bg-[#722F37]/10 text-[#722F37]" 
            : "bg-[#F8F9FA] text-[#D5C1C4] hover:bg-gray-100"
        )}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {theme === "red" && !isAnimating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-[2px] border-2 border-[#722F37] rounded-lg pointer-events-none" 
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isAnimating ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Wine className={cn("w-6 h-6 transition-colors duration-500", theme === "red" ? "text-[#722F37]" : "text-[#D5C1C4]")} />
              <span className="text-xs font-body font-semibold uppercase tracking-widest text-[#722F37]">赤ワイン</span>
            </motion.div>
          ) : (
            <motion.div
              key="animation"
              variants={cheersVariants}
              initial="initial"
              animate="cheers"
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <motion.span variants={glassLeftVariants} className="text-2xl">🍷</motion.span>
              <motion.span variants={glassRightVariants} className="text-2xl">🍷</motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => handleThemeChange("white")}
        whileTap={{ scale: 0.8 }}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-500 w-28 h-24 overflow-visible",
          theme === "white" 
            ? "bg-[#DCD48E]/20 text-[#635B21]" 
            : "bg-[#F8F9FA] text-[#E6E2C3] hover:bg-gray-100"
        )}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {theme === "white" && !isAnimating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-[2px] border-2 border-[#DCD48E] rounded-lg pointer-events-none" 
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isAnimating ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Wine className={cn("w-6 h-6 transition-colors duration-500", theme === "white" ? "text-[#635B21]" : "text-[#E6E2C3]")} />
              <span className="text-xs font-body font-semibold uppercase tracking-widest text-[#635B21]">白ワイン</span>
            </motion.div>
          ) : (
            <motion.div
              key="animation"
              variants={cheersVariants}
              initial="initial"
              animate="cheers"
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <motion.span variants={glassLeftVariants} className="text-2xl">🥂</motion.span>
              <motion.span variants={glassRightVariants} className="text-2xl">🥂</motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
