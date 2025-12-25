import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
        background: "bg-[#F9F3F0]",
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
        cardStyles.background,
        cardStyles.shadow
      )}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-texture-paper opacity-50 pointer-events-none" />

      {/* Content Container */}
      <div className="relative flex flex-col p-8 md:p-12">
        
        {/* Wine Name and Average Rating */}
        <div className="text-center mb-6 pb-6 border-b border-gray-200">
          <h2 className={cn(
            "font-display text-2xl md:text-3xl leading-tight tracking-wide break-words mb-3",
            cardStyles.text,
            !data.wineName && "opacity-40"
          )}>
            {data.wineName || "ワイン名未入力"}
          </h2>
          
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => {
              const averageRating = (data.myRating + data.partnerRating) / 2;
              return (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i <= averageRating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-300"
                  )}
                />
              );
            })}
          </div>

          {/* Wine Information */}
          <motion.div 
            className="text-sm overflow-hidden min-h-[1.5rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {data.location || data.price ? (
                <motion.p 
                  key="info"
                  className={cn("font-body", cardStyles.text)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {data.location && (
                    <>
                      <span className="opacity-60">場所: </span>
                      <motion.span
                        key={`location-${data.location}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {data.location}
                      </motion.span>
                      {data.price && <span className="mx-2">|</span>}
                    </>
                  )}
                  {data.price && (
                    <>
                      <span className="opacity-60">価格: </span>
                      <motion.span
                        key={`price-${data.price}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        ¥{data.price.toLocaleString()}
                      </motion.span>
                    </>
                  )}
                </motion.p>
              ) : (
                <motion.p 
                  key="placeholder"
                  className={cn("font-body text-gray-300 italic", cardStyles.text)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  場所と価格をまだ入力していません
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 space-y-8">
          {/* My Comment */}
          <div className="relative group">
            <Quote className={cn("absolute -top-3 -left-2 w-8 h-8 rotate-180", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              わたしの感想
            </h3>
            <div className={cn("flex flex-wrap gap-1", (!data.myComment || data.myComment.length === 0) && "opacity-40 min-h-[3rem] flex items-center")}>
              {data.myComment && data.myComment.length > 0 ? (
                data.myComment.map((comment) => (
                  <Badge key={comment} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300">
                    {comment}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">何か選んでね</span>
              )}
            </div>
          </div>

          {/* Partner's Comment */}
          <div className="relative group text-right">
            <Quote className={cn("absolute -top-3 -right-2 w-8 h-8", cardStyles.quote)} />
            <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2 opacity-60", cardStyles.text)}>
              あなたの感想
            </h3>
            <div className={cn("flex flex-wrap gap-1 justify-end", (!data.partnerComment || data.partnerComment.length === 0) && "opacity-40 min-h-[3rem] flex items-center")}>
              {data.partnerComment && data.partnerComment.length > 0 ? (
                data.partnerComment.map((comment) => (
                  <Badge key={comment} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300">
                    {comment}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">何か選んでね</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
