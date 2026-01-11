import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheersAnimation } from "@/components/ui/CheersAnimation";

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
    setTimeout(() => setAnimatingTheme(null), 800); // Match CheersAnimation duration
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
              className="absolute inset-[2px] bg-[#722F37]/5 rounded-lg pointer-events-none" 
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
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <CheersAnimation />
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
              className="absolute inset-[2px] bg-[#DCD48E]/10 rounded-lg pointer-events-none" 
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
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="scale-x-[-1]">
                <CheersAnimation />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
