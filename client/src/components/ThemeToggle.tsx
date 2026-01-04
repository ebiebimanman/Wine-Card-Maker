import { motion } from "framer-motion";
import { Wine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  theme: "red" | "white";
  onThemeChange: (theme: "red" | "white") => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const tapAnimation = {
    scale: [1, 0.9, 1.1, 1],
    transition: {
      duration: 0.4,
      times: [0, 0.2, 0.7, 1],
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex gap-4 items-center justify-center p-4">
      <motion.button
        type="button"
        onClick={() => onThemeChange("red")}
        whileTap={tapAnimation}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 w-28",
          theme === "red" 
            ? "bg-[#722F37] text-white" 
            : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
        )}
      >
        <Wine className={cn("w-6 h-6", theme === "red" ? "text-white" : "text-[#722F37]")} />
        <span className="text-xs font-sans font-semibold uppercase tracking-widest">赤ワイン</span>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => onThemeChange("white")}
        whileTap={tapAnimation}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 w-28",
          theme === "white" 
            ? "bg-[#DCD48E] text-[#635B21] border border-[#C5BC6A]" 
            : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
        )}
      >
        <div className="relative">
          <Wine className={cn("w-6 h-6", theme === "white" ? "text-[#FFFAEB]" : "text-[#DCD48E]/50")} />
        </div>
        <span className="text-xs font-sans font-semibold uppercase tracking-widest">白ワイン</span>
      </motion.button>
    </div>
  );
}
