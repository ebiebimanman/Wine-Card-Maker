import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";
import { COMMENT_OPTIONS } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function CommentPage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin, location, price, rating } =
    useFlowParams();
  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const hasText = comment.length > 0;
  const isActive = hasText || isFocused;

  return (
    <QuestionScreenLayout
      stepIndex={9}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="コメントをどうぞ"
      onNext={() => {
        setLocation(
          `/card${buildFlowQuery({
            theme,
            name,
            variety,
            origin,
            location,
            price,
            rating,
            comment: comment.trim(),
          })}`
        );
      }}
    >
      <div className="w-full gap-2 flex flex-col">
        <div className="relative w-full rounded-[16px] bg-[#f5f1e8] flex items-start justify-center px-4 pt-7 pb-4">
          {/* フローティングラベル */}
          <label
            className={cn(
              "absolute left-1/2 -translate-x-1/2 text-center text-[#aca3a3] pointer-events-none transition-all duration-200",
              isActive
                ? "top-1 text-[11px] tracking-wide"
                : "top-1/2 -translate-y-1/2 text-[14px]",
            )}
          >
            自由にコメントを入力
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none resize-none min-h-[72px]"
            rows={3}
          />
        </div>
        <p className="text-[12px] text-[#5c5246] text-center">
          例: {COMMENT_OPTIONS.slice(0, 3).join("、")} など
        </p>
      </div>
    </QuestionScreenLayout>
  );
}
