import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";
import { wineOrigins } from "@/data/wineOrigins";

interface OriginQuestionScreenProps {
  stepIndex?: number;
  onBack: () => void;
  onNext: (origin: string) => void;
}

export const OriginQuestionScreen: React.FC<OriginQuestionScreenProps> = ({
  stepIndex = 4,
  onBack,
  onNext,
}) => {
  const [originInput, setOriginInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // サジェスト選択直後のIME確定イベントを無視するフラグ
  const isSelectingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const suggestions = useMemo(() => {
    const q = originInput.trim().toLowerCase();
    if (!q) return wineOrigins.slice(0, 12);
    return wineOrigins
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [originInput]);

  const handleSelect = (value: string) => {
    // IME確定イベントによるonChangeを無視するフラグをセット
    isSelectingRef.current = true;
    inputRef.current?.blur();
    setOriginInput(value);
    // IMEのすべてのイベントが落ち着いた後にフラグをリセット
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
    onNext(originInput.trim());
  };

  const header = (
    <div className="w-full shrink-0 flex flex-col items-center gap-8 pb-0">
      <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
        産地は？
      </p>
      <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
        <label className="absolute left-1/2 -translate-x-1/2 top-1 text-[11px] tracking-wide text-center text-[#aca3a3] pointer-events-none font-normal origin-center">
          産地を入力または選択
        </label>
        <input
          ref={inputRef}
          type="text"
          value={originInput}
          onChange={(e) => {
            if (isSelectingRef.current) return;
            setOriginInput(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
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
      onNext={handleNext}
      nextDisabled={!originInput.trim()}
      header={header}
    >
      {suggestions.length > 0 && (
        <motion.div
          className="w-full flex-1 min-h-0 flex flex-col self-stretch pb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="pt-2">
            <div className="flex-1 min-h-0 overflow-hidden rounded-2xl bg-[#fffbf1] ring-1 ring-[#e0d8c8]/50 shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]">
              <ScrollArea className="flex-1 w-full">
                <ul
                  id="origin-suggestions-list"
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

