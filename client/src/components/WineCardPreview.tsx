import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsertWineCard } from "@shared/schema";

interface WineCardPreviewProps {
  data: InsertWineCard;
  theme: "red" | "white";
}

export function WineCardPreview({ data, theme }: WineCardPreviewProps) {
  const isRed = theme === "red";

  // Dynamic styles based on theme
  const cardStyles = isRed
    ? {
        background: "bg-[#FDFBF7]",
        border: "border-[#722F37]",
        text: "text-[#2D2424]",
        accent: "text-[#722F37]",
        divider: "bg-[#722F37]/20",
        quote: "text-[#722F37]/10",
        shadow: "shadow-2xl shadow-[#722F37]/10",
      }
    : {
        background: "bg-[#FFFFFF]",
        border: "border-[#A8B5A2]", // Sage green border
        text: "text-[#343A40]",
        accent: "text-[#6B705C]", // Olive accent
        divider: "bg-[#A8B5A2]/20",
        quote: "text-[#A8B5A2]/15",
        shadow: "shadow-2xl shadow-[#A8B5A2]/15",
      };

  return (
    <motion.div
      layout
      className={cn(
        "relative w-full max-w-md mx-auto aspect-[3/5] rounded-sm overflow-hidden transition-all duration-500",
        cardStyles.background,
        cardStyles.shadow,
        "border-[12px] border-double", // Menu-style double border
        cardStyles.border
      )}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-texture-paper opacity-50 pointer-events-none" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col p-8 md:p-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center mb-4 opacity-80">
            {/* Decorative flourish or simple line */}
            <div className={cn("w-16 h-[1px]", cardStyles.accent, "bg-current opacity-40")} />
          </div>
          
          <h2 className={cn(
            "font-display text-3xl md:text-4xl italic leading-tight tracking-wide break-words",
            cardStyles.accent
          )}>
            {data.wineName || "Le Vin Mystère"}
          </h2>
          
          <div className="flex justify-center gap-1 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i <= data.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={cn("w-full h-px mb-8", cardStyles.divider)} />

        {/* Comments Section */}
        <div className="flex-1 space-y-8">
          {/* My Comment */}
          <div className="relative group">
            <Quote className={cn("absolute -top-3 -left-2 w-8 h-8 rotate-180", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              My Thoughts
            </h3>
            <p className={cn("font-body text-base leading-relaxed italic opacity-90 min-h-[3rem]", cardStyles.text)}>
              {data.myComment || "What did you think of the aroma? The texture? The finish?"}
            </p>
          </div>

          {/* Partner's Comment */}
          <div className="relative group text-right">
            <Quote className={cn("absolute -top-3 -right-2 w-8 h-8", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              Partner's Thoughts
            </h3>
            <p className={cn("font-body text-base leading-relaxed italic opacity-90 min-h-[3rem]", cardStyles.text)}>
              {data.partnerComment || "And what did they say? Sweet? Dry? Memorable?"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className={cn("font-script text-2xl opacity-40", cardStyles.accent)}>
            Bon Appétit
          </p>
          <div className="text-[10px] uppercase tracking-[0.2em] mt-2 opacity-30 font-sans">
            Tasting Notes • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
