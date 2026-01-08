import { motion } from "framer-motion";
import { Wine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  theme: "red" | "white";
  onThemeChange: (theme: "red" | "white") => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const tapAnimation = {
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
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
            ? "bg-[#722F37]/10 text-[#722F37]" 
            : "bg-[#f0f0f0] text-[#D5C1C4] hover:bg-gray-100"
        )}
      >
        {theme === "red" && (
          <div className="absolute inset-[2px] border border-[#722F37] rounded-[10px] pointer-events-none" />
        )}
        <Wine className={cn("w-6 h-6", theme === "red" ? "text-[#722F37]" : "text-[#D5C1C4]")} />
        <span className="text-xs font-body font-semibold uppercase tracking-widest text-[#722F37]">赤ワイン</span>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => onThemeChange("white")}
        whileTap={tapAnimation}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 w-28",
          theme === "white" 
            ? "bg-[#DCD48E]/20 text-[#635B21]" 
            : "bg-[#f0f0f0] text-[#E6E2C3] hover:bg-gray-100"
        )}
      >
        {theme === "white" && (
          <div className="absolute inset-[2px] border border-[#DCD48E] rounded-[10px] pointer-events-none" />
        )}
        <div className="relative">
          <Wine className={cn("w-6 h-6", theme === "white" ? "text-[#635B21]" : "text-[#E6E2C3]")} />
        </div>
        <span className="text-xs font-body font-semibold uppercase tracking-widest text-[#635B21]">白ワイン</span>
      </motion.button>
    </div>
  );
}
