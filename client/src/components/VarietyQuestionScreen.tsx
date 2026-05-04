import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";
import { wineVarieties } from "@/data/wineVarieties";

interface VarietyQuestionScreenProps {
  stepIndex?: number;
  onBack: () => void;
  onNext: (variety: string) => void;
}

export const VarietyQuestionScreen: React.FC<VarietyQuestionScreenProps> = ({
  stepIndex = 5,
  onBack,
  onNext,
}) => {
  const [varietyInput, setVarietyInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);

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
    setHideSuggestions(true);
    requestAnimationFrame(() => {
      isSelectingRef.current = false;
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const showingSuggestions = !hideSuggestions && suggestions.length > 0;
    if (e.key === "ArrowDown" && showingSuggestions) {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev + 1 < suggestions.length ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp" && showingSuggestions) {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      if (showingSuggestions) {
        handleSelect(suggestions[activeIndex]);
      } else {
        handleNext();
      }
    }
  };

  const handleNext = () => {
    onNext(varietyInput.trim());
  };

  const header = (
    <div className="w-full shrink-0 flex flex-col items-center gap-8 pb-0">
      <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
        品種は？
      </p>
      <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
        <label className="absolute left-1/2 -translate-x-1/2 top-1 text-[11px] tracking-wide text-center text-[#aca3a3] pointer-events-none font-normal origin-center">
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
            setHideSuggestions(false);
          }}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (related && (related.tagName === "BUTTON" || related.tagName === "A")) {
              return;
            }
            setTimeout(() => {
              if (!inputRef.current?.isConnected) return;
              if (varietyInput.trim()) handleNext();
            }, 50);
          }}
          enterKeyHint="next"
          placeholder=""
          className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
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
    >
      {!hideSuggestions && suggestions.length > 0 && (
        <motion.div
          className="w-full flex-1 min-h-0 flex flex-col self-stretch pt-2 pb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex-1 min-h-0 overflow-hidden rounded-2xl bg-[#fffbf1] ring-1 ring-[#e0d8c8]/50 shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]">
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
                        "w-full min-h-[36px] flex items-center justify-center px-6 py-2 text-sm transition-colors duration-150",
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
        </motion.div>
      )}
    </BottomSheetQuestionLayout>
  );
};

