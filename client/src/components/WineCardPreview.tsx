import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { InsertWineCard } from "@shared/schema";
import { PAIRED_FOOD_OPTIONS, COMMENT_OPTIONS } from "@shared/schema";

// アイコンマッピング
type FoodOption = typeof PAIRED_FOOD_OPTIONS[number];
type CommentOption = typeof COMMENT_OPTIONS[number];

const PAIRED_FOOD_ICONS: Record<FoodOption, string> = {
  "チーズ": "🧀",
  "ステーキ": "🥩",
  "魚料理": "🐟",
  "和食": "🍣",
  "パスタ": "🍝",
  "チョコレート": "🍫",
  "デザート": "🍰",
  "海鮮": "🦐",
  "フルーツ": "🍇",
  "前菜": "🥗",
};

const COMMENT_ICONS: Record<CommentOption, string> = {
  "香りが良い": "🌹",
  "飲みやすい": "💧",
  "後味が良い": "✨",
  "深い味わい": "🌙",
  "フルーティー": "🍎",
  "華やか": "🎆",
  "しっかりした味": "💪",
  "爽やか": "🌿",
  "上品": "👑",
  "クリーミー": "☁️",
};

interface WineCardPreviewProps {
  data: InsertWineCard;
  theme: "red" | "white";
}

export function WineCardPreview({ data, theme }: WineCardPreviewProps) {
  const isRed = theme === "red";
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const maxHeight = 320; // max-h-80 = 320px

  useEffect(() => {
    if (data.wineImage) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = data.wineImage;
    } else {
      setImageSize(null);
    }
  }, [data.wineImage]);

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
        
        {/* Wine Image */}
        {data.wineImage && (
          <div className="mb-6 -mt-4 -mx-4 md:-mx-8 flex items-center justify-center bg-gray-50/50 rounded-lg overflow-hidden">
            {imageSize ? (
              <motion.img
                src={data.wineImage}
                alt={data.wineName || "ワイン画像"}
                className="object-contain"
                style={{
                  width: '100%',
                  height: imageSize.height > maxHeight 
                    ? `${maxHeight}px`
                    : 'auto',
                  maxHeight: `${maxHeight}px`,
                  aspectRatio: `${imageSize.width} / ${imageSize.height}`,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.img
                src={data.wineImage}
                alt={data.wineName || "ワイン画像"}
                className="w-full max-h-64 md:max-h-80 object-contain"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        )}
        
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
            className="text-sm overflow-hidden space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Origin and Variety */}
            {(data.origin || data.variety) && (
              <motion.div
                key="origin-variety"
                className={cn("font-body", cardStyles.text)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {data.origin && (
                  <>
                    <span className="opacity-60">産地: </span>
                    <motion.span
                      key={`origin-${data.origin}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {data.origin}
                    </motion.span>
                    {data.variety && <span className="mx-2">|</span>}
                  </>
                )}
                {data.variety && (
                  <>
                    <span className="opacity-60">品種: </span>
                    <motion.span
                      key={`variety-${data.variety}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {data.variety}
                    </motion.span>
                  </>
                )}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {data.location ? (
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

            {/* Paired Food */}
            <AnimatePresence mode="wait">
              {data.pairedFood && data.pairedFood.length > 0 ? (
                <motion.div 
                  key="food"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className={cn("font-display text-xs uppercase tracking-widest mb-1 opacity-60", cardStyles.text)}>
                    ペアリング
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.pairedFood.map((food) => (
                      <Badge 
                        key={food} 
                        className="px-3 py-1.5 rounded-full text-sm font-body bg-gray-200 text-gray-700 flex items-center gap-1.5 border-0"
                      >
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-lg leading-none">
                          {PAIRED_FOOD_ICONS[food as FoodOption] || ""}
                        </span>
                        <span>{food}</span>
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.p 
                  key="food-placeholder"
                  className={cn("font-body text-gray-300 italic", cardStyles.text)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  料理をまだ選んでいません
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
            <div className={cn("flex flex-wrap gap-2", (!data.myComment || data.myComment.length === 0) && "opacity-40 min-h-[3rem] flex items-center")}>
              {data.myComment && data.myComment.length > 0 ? (
                data.myComment.map((comment) => (
                  <Badge 
                    key={comment} 
                    className="px-3 py-1.5 rounded-full text-sm font-body bg-gray-200 text-gray-700 flex items-center gap-1.5 border-0"
                  >
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-lg leading-none">
                      {COMMENT_ICONS[comment as CommentOption] || ""}
                    </span>
                    <span>{comment}</span>
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
            <div className={cn("flex flex-wrap gap-2 justify-end", (!data.partnerComment || data.partnerComment.length === 0) && "opacity-40 min-h-[3rem] flex items-center")}>
              {data.partnerComment && data.partnerComment.length > 0 ? (
                data.partnerComment.map((comment) => (
                  <Badge 
                    key={comment} 
                    className="px-3 py-1.5 rounded-full text-sm font-body bg-gray-200 text-gray-700 flex items-center gap-1.5 border-0"
                  >
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-lg leading-none">
                      {COMMENT_ICONS[comment as CommentOption] || ""}
                    </span>
                    <span>{comment}</span>
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
