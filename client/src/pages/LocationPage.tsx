import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function LocationPage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin } = useFlowParams();
  const [locationValue, setLocationValue] = useState("");

  return (
    <QuestionScreenLayout
      stepIndex={5}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="場所は？"
      onNext={() => {
        setLocation(
          `/price${buildFlowQuery({
            theme,
            name,
            variety,
            origin,
            location: locationValue.trim(),
          })}`
        );
      }}
      nextDisabled={!locationValue.trim()}
    >
      <div className="w-full">
        <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
          <input
            type="text"
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            placeholder="購入店・飲んだ場所など"
            className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none placeholder:text-[#aca3a3]"
          />
        </div>
      </div>
    </QuestionScreenLayout>
  );
}
