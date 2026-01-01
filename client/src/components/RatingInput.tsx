import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  readOnly?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "にがて",
  2: "リピなし",
  3: "ふつう",
  4: "また飲みたい",
  5: "殿堂入り",
};

export function RatingInput({ value, onChange, className, readOnly = false }: RatingInputProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // 評価が変わるたびに、アニメーションを最初から実行
    setIsAnimating(true);
    setDisplayValue(0);
    setAnimationKey(prev => prev + 1); // keyを更新してアニメーションをリセット
    
    // 少し待ってから、左から右へ順番に点灯（速度を1.5〜2倍に）
    setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setDisplayValue(current);
        
        if (current >= value) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnimating(false);
          }, 50);
        }
      }, 50); // 各星の間隔（ミリ秒）- 100msから50msに短縮
    }, 30); // 初期リセット後の少しの待機時間 - 50msから30msに短縮
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 評価テキスト用の固定余白 */}
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {value > 0 && (
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm font-medium text-rose-600"
            >
              {RATING_LABELS[value]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div 
        key={animationKey}
        className={cn("flex gap-1", className)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayValue;
          const animationDelay = (star - 1) * 0.05; // 0.1から0.05に短縮（2倍速）
          
          return (
            <motion.button
              key={star}
              type="button"
              disabled={readOnly || isAnimating}
              onClick={() => onChange(star)}
              whileTap={!readOnly && !isAnimating ? { scale: 0.95 } : {}}
              className={cn(
                "relative p-1 focus:outline-none",
                readOnly ? "cursor-default" : "cursor-pointer"
              )}
            >
              {/* 背景の星（常に表示） */}
              <Star className="w-6 h-6 fill-transparent text-muted-foreground/30" />
              
              {/* 色付きの星（オーバーレイ） */}
              {isFilled && (
                <motion.div
                  key={`filled-${star}-${animationKey}`}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 600, // 500から600に上げてより速く
                    damping: 30, // 25から30に上げてより速く
                    delay: animationDelay
                  }}
                >
                  <Star className="w-6 h-6 fill-accent text-accent" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
