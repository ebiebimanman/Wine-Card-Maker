import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";
import { wineVarieties } from "@/data/wineVarieties";

interface VarietyQuestionScreenProps {
  stepIndex?: number;
  wineImageSrc?: string;
  onBack: () => void;
  onNext: (variety: string) => void;
}

export const VarietyQuestionScreen: React.FC<VarietyQuestionScreenProps> = ({
  stepIndex = 5,
  wineImageSrc = "/wine-glass.png",
  onBack,
  onNext,
}) => {
  const [varietyInput, setVarietyInput] = useState("");
  const isOpen = true;

  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);

  const hasText = varietyInput.trim().length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const suggestions = useMemo(() => {
    const q = varietyInput.trim().toLowerCase();
    if (!q) return [];
    return wineVarieties
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [varietyInput]);

  const handleSelect = (value: string) => {
    isSelectingRef.current = true;
    inputRef.current?.blur();
    setVarietyInput(value);
    requestAnimationFrame(() => {
      isSelectingRef.current = false;
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev + 1 < suggestions.length ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  };

  const handleNext = () => {
    onNext(varietyInput.trim());
  };

  const header = (
    <motion.div
      className={cn(
        "w-full shrink-0 flex flex-col items-center gap-8",
        isOpen ? "pb-0" : "pb-12",
      )}
    >
      <motion.p
        className="text-center text-[20px] font-bold text-[#2c2c2c]"
      >
        品種は？
      </motion.p>
      <motion.div
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
          品種を入力または選択
        </label>
        <input
          ref={inputRef}
          type="text"
          value={varietyInput}
          onChange={(e) => {
            if (isSelectingRef.current) return;
            setVarietyInput(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder=""
          className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
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
      {isOpen && suggestions.length > 0 && (
        <motion.div
          className="w-full self-stretch pb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="pt-2">
            <div
              className="overflow-hidden rounded-2xl bg-[#fffbf1] ring-1 ring-[#e0d8c8]/50 shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]"
              style={{ height: Math.min(suggestions.length * 44 + 16, 236) + "px" }}
            >
              <ScrollArea className="h-full w-full">
                <ul
                  id="variety-suggestions-list"
                  role="listbox"
                  className="flex flex-col py-2"
                >
                  {suggestions.map((name, index) => (
                    <li
                      key={`${name}-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(name)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "w-full min-h-[44px] flex items-center justify-center px-6 py-4 text-base transition-colors duration-150",
                          index === activeIndex
                            ? "bg-[#f5f1e8] text-[#2c2c2c] rounded-xl mx-2 w-[calc(100%-16px)]"
                            : "text-[#5c5246] hover:bg-[#f5f1e8]/50"
                        )}
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
        </motion.div>
      )}
    </BottomSheetQuestionLayout>
  );
};

