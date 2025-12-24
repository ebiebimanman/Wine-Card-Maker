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
        "relative w-full max-w-md mx-auto h-auto rounded-[16px] overflow-hidden transition-all duration-500",
        "bg-[#FFFFFF]",
        cardStyles.shadow
      )}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-texture-paper opacity-50 pointer-events-none" />

      {/* Content Container */}
      <div className="relative flex flex-col p-8 md:p-12">
        
        {/* Wine Name and Ratings */}
        <div className="text-center mb-6 pb-6 border-b border-gray-200">
          <h2 className={cn(
            "font-display text-2xl md:text-3xl leading-tight tracking-wide break-words mb-3",
            cardStyles.text,
            !data.wineName && "opacity-40"
          )}>
            {data.wineName || "ワイン名未入力"}
          </h2>
          
          <div className="space-y-3">
            {/* My Rating */}
            <div>
              <p className={cn("text-xs uppercase tracking-widest mb-1 opacity-60", cardStyles.text)}>わたし</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i <= data.myRating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Partner Rating */}
            <div>
              <p className={cn("text-xs uppercase tracking-widest mb-1 opacity-60", cardStyles.text)}>あなた</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i <= data.partnerRating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 space-y-8">
          {/* My Comment */}
          <div className="relative group">
            <Quote className={cn("absolute -top-3 -left-2 w-8 h-8 rotate-180", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              わたしの感想
            </h3>
            <p className={cn("font-body text-base leading-relaxed min-h-[3rem]", cardStyles.text, !data.myComment && "opacity-40")}>
              {data.myComment || "香りはどう？口当たりは？後味は？"}
            </p>
          </div>

          {/* Partner's Comment */}
          <div className="relative group text-right">
            <Quote className={cn("absolute -top-3 -right-2 w-8 h-8", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              あなたの感想
            </h3>
            <p className={cn("font-body text-base leading-relaxed min-h-[3rem]", cardStyles.text, !data.partnerComment && "opacity-40")}>
              {data.partnerComment || "相手は甘い？辛い？心に残った？"}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
