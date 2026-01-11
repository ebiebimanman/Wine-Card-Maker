import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  theme: "red" | "white";
  onThemeChange: (theme: "red" | "white") => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const [animatingTheme, setAnimatingTheme] = useState<"red" | "white" | null>(null);

  const handleThemeChange = (newTheme: "red" | "white") => {
    if (animatingTheme) return;
    setAnimatingTheme(newTheme);
    onThemeChange(newTheme);
    setTimeout(() => setAnimatingTheme(null), 1600); // Total duration of complex animation
  };

  const cheersVariants = {
    initial: { opacity: 0 },
    cheers: {
      opacity: [0, 1, 1, 0],
      transition: {
        times: [0, 0.1, 0.8, 1], // Faster fade in
        duration: 1.6,
      }
    }
  };

  const glassLeftVariants = {
    initial: { x: -20, scale: 0, opacity: 0, rotate: 0 },
    cheers: {
      x: [-20, 0, -5, 0], // Fast move to center for clink
      scale: [0, 1.5, 1.5, 0],
      opacity: [0, 1, 1, 0],
      rotate: [0, -15, -15, 0],
      transition: {
        duration: 1.6,
        times: [0, 0.2, 0.8, 1], // Clink happens at 0.2s (fast), then stay, then fade
        ease: ["easeOut", "linear", "easeIn"]
      }
    }
  };

  const glassRightVariants = {
    initial: { x: 20, scale: 0, opacity: 0, rotate: 0 },
    cheers: {
      x: [20, 0, 5, 0], // Fast move to center for clink
      scale: [0, 1.5, 1.5, 0],
      opacity: [0, 1, 1, 0],
      rotate: [0, 15, 15, 0],
      transition: {
        duration: 1.6,
        times: [0, 0.2, 0.8, 1],
        ease: ["easeOut", "linear", "easeIn"]
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
          {theme === "red" && animatingTheme !== "red" && (
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
          {animatingTheme !== "red" ? (
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
          {theme === "white" && animatingTheme !== "white" && (
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
          {animatingTheme !== "white" ? (
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
