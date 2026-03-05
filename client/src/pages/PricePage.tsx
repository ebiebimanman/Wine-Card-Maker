import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function PricePage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin, location } = useFlowParams();
  const [price, setPrice] = useState("");

  return (
    <QuestionScreenLayout
      stepIndex={6}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="値段は？（円）"
      onNext={() => {
        setLocation(
          `/rating${buildFlowQuery({
            theme,
            name,
            variety,
            origin,
            location,
            price: price.trim(),
          })}`
        );
      }}
    >
      <div className="w-full">
        <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="例: 2500"
            className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none placeholder:text-[#aca3a3]"
          />
          <span className="absolute right-4 text-[14px] text-[#5c5246]">円</span>
        </div>
      </div>
    </QuestionScreenLayout>
  );
}
