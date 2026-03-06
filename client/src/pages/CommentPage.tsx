import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";
import { COMMENT_OPTIONS } from "@shared/schema";

export default function CommentPage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin, location, price, rating } =
    useFlowParams();
  const [comment, setComment] = useState("");

  return (
    <QuestionScreenLayout
      stepIndex={9}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="自分のコメントは？"
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
        <div className="relative w-full min-h-[80px] rounded-[16px] bg-[#f5f1e8] flex items-start justify-center p-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="自由にコメントを入力"
            className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none placeholder:text-[#aca3a3] resize-none min-h-[60px]"
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
