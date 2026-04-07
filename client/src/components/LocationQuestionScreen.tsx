import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";

interface LocationQuestionScreenProps {
  stepIndex?: number;
  wineImageSrc?: string;
  onBack: () => void;
  onNext: (location: string) => void;
}

export const LocationQuestionScreen: React.FC<
  LocationQuestionScreenProps
> = ({
  stepIndex = 6,
  wineImageSrc = "/wine-bottle.png",
  onBack,
  onNext,
}) => {
  const [locationInput, setLocationInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasText = locationInput.trim().length > 0;

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleNext = () => {
    onNext(locationInput.trim());
  };

  const header = (
    <motion.div
      layout
      className={cn(
        "w-full shrink-0 flex flex-col items-center gap-8",
        isOpen ? "pb-0" : "pb-12",
      )}
    >
      <motion.p
        layout="position"
        className="text-center text-[20px] font-bold text-[#2c2c2c]"
      >
        場所は？
      </motion.p>
      <motion.div
        layout
        className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4"
      >
        <label
          className={cn(
            "absolute left-1/2 -translate-x-1/2 text-center text-[#aca3a3] pointer-events-none transition-all duration-200 text-[14px] font-normal",
            "origin-center",
            hasText || isOpen
              ? "top-1 text-[11px] tracking-wide"
              : "top-1/2 -translate-y-1/2",
          )}
        >
          購入店・飲んだ場所など
        </label>
        <input
          ref={inputRef}
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder=""
          className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none placeholder:text-[#aca3a3]"
        />
      </motion.div>
    </motion.div>
  );

  return (
    <BottomSheetQuestionLayout
      stepIndex={stepIndex}
      onBack={onBack}
      isOpen={isOpen}
      wineImageSrc={wineImageSrc}
      onNext={handleNext}
      nextDisabled={false}
      header={header}
    >
      {/* 場所は現状サジェストなしなので可変コンテンツは空 */}
    </BottomSheetQuestionLayout>
  );
};

