import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { RatingInput } from "@/components/RatingInput";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function RatingPage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin, location, price } = useFlowParams();
  const [rating, setRating] = useState(0);

  return (
    <QuestionScreenLayout
      stepIndex={8}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="このワインの評価は？"
      onNext={() => {
        setLocation(
          `/comment${buildFlowQuery({
            theme,
            name,
            variety,
            origin,
            location,
            price,
            rating: String(rating),
          })}`
        );
      }}
    >
      {name && (
        <p className="text-center text-[14px] text-[#5c5246] w-full">{name}</p>
      )}
      <RatingInput value={rating} onChange={setRating} />
    </QuestionScreenLayout>
  );
}
