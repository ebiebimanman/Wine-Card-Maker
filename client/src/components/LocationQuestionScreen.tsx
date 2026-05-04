import React, { useState, useRef, useEffect } from "react";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";

interface LocationQuestionScreenProps {
  stepIndex?: number;
  onBack: () => void;
  onNext: (location: string) => void;
}

export const LocationQuestionScreen: React.FC<
  LocationQuestionScreenProps
> = ({
  stepIndex = 6,
  onBack,
  onNext,
}) => {
  const [locationInput, setLocationInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNext = () => {
    onNext(locationInput.trim());
  };

  const header = (
    <div className="w-full shrink-0 flex flex-col items-center gap-8 pb-0">
      <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
        場所は？
      </p>
      <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
        <label className="absolute left-1/2 -translate-x-1/2 top-1 text-[11px] tracking-wide text-center text-[#aca3a3] pointer-events-none font-normal origin-center">
          購入店・飲んだ場所など
        </label>
        <input
          ref={inputRef}
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.nativeEvent.isComposing) return;
              e.preventDefault();
              handleNext();
            }
          }}
          onBlur={(e) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (related && (related.tagName === "BUTTON" || related.tagName === "A")) {
              return;
            }
            setTimeout(() => {
              if (!inputRef.current?.isConnected) return;
              if (locationInput.trim()) handleNext();
            }, 50);
          }}
          enterKeyHint="next"
          placeholder=""
          className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none placeholder:text-[#aca3a3]"
        />
      </div>
    </div>
  );

  return (
    <BottomSheetQuestionLayout
      stepIndex={stepIndex}
      onBack={onBack}
      header={header}
      hideNextButton
    />
  );
};
