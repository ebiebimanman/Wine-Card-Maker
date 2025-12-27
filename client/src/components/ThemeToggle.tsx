import { motion } from "framer-motion";
import { Wine, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  theme: "red" | "white";
  onThemeChange: (theme: "red" | "white") => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="flex gap-4 items-center justify-center p-4">
      <button
        type="button"
        onClick={() => onThemeChange("red")}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 w-28",
          theme === "red" 
            ? "bg-[#722F37] text-white shadow-lg scale-105 ring-2 ring-[#722F37]/20" 
            : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
        )}
      >
        <Wine className={cn("w-6 h-6", theme === "red" ? "text-white" : "text-[#722F37]")} />
        <span className="text-xs font-semibold uppercase tracking-widest">赤ワイン</span>
      </button>

      <button
        type="button"
        onClick={() => onThemeChange("white")}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 w-28",
          theme === "white" 
            ? "bg-[#F8F9FA] text-[#868e96] border border-[#E9ECEF] shadow-lg scale-105 ring-2 ring-[#F1F3F5]" 
            : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
        )}
      >
        <div className="relative">
          <Wine className={cn("w-6 h-6", theme === "white" ? "text-[#E6DB74]" : "text-[#E6DB74]/50")} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">白ワイン</span>
      </button>
    </div>
  );
}
