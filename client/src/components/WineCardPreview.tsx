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
        "relative w-full max-w-md mx-auto aspect-[3/5] rounded-[16px] overflow-hidden transition-all duration-500",
        "bg-[#FFFFFF]",
        cardStyles.shadow
      )}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-texture-paper opacity-50 pointer-events-none" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col p-8 md:p-12">
        
        {/* Wine Name and Rating */}
        <div className="text-center mb-6 pb-6 border-b border-gray-200">
          <h2 className={cn(
            "font-display text-2xl md:text-3xl leading-tight tracking-wide break-words mb-3",
            cardStyles.text
          )}>
            {data.wineName || "ワイン名未入力"}
          </h2>
          
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i <= data.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 space-y-8">
          {/* My Comment */}
          <div className="relative group">
            <Quote className={cn("absolute -top-3 -left-2 w-8 h-8 rotate-180", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              私の感想
            </h3>
            <p className={cn("font-body text-base leading-relaxed italic opacity-90 min-h-[3rem]", cardStyles.text)}>
              {data.myComment || "香りはどう？口当たりは？後味は？"}
            </p>
          </div>

          {/* Partner's Comment */}
          <div className="relative group text-right">
            <Quote className={cn("absolute -top-3 -right-2 w-8 h-8", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              パートナーの感想
            </h3>
            <p className={cn("font-body text-base leading-relaxed italic opacity-90 min-h-[3rem]", cardStyles.text)}>
              {data.partnerComment || "相手は甘い？辛い？心に残った？"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className={cn("font-script text-2xl opacity-40", cardStyles.accent)}>
            乾杯
          </p>
          <div className="text-[10px] uppercase tracking-[0.2em] mt-2 opacity-30 font-sans">
            テイスティングノート • {new Date().toLocaleDateString('ja-JP')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
