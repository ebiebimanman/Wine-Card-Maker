import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { popularWines } from "@/data/popularWines";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";
import {
  normalizeForName,
  normalizeForQuery,
  scoreMatch,
} from "@/lib/textNormalize";

interface NameQuestionScreenProps {
  /** 現在のステップ番号（1〜10） */
  stepIndex?: number;
  /** 戻るボタン押下時 */
  onBack?: () => void;
  /** つぎへボタン押下時（入力されたワイン名を渡す） */
  onNext?: (wineName: string) => void;
}

export const NameQuestionScreen: React.FC<NameQuestionScreenProps> = ({
  stepIndex = 2,
  onBack,
  onNext,
}) => {
  const [wineName, setWineName] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const sheetInputRef = useRef<HTMLInputElement>(null);
  // サジェスト選択直後のIME確定イベントを無視するフラグ
  const isSelectingRef = useRef(false);

  useEffect(() => {
    sheetInputRef.current?.focus();
  }, []);

  const suggestions = useMemo(() => {
    const raw = wineName.trim();
    if (!raw) return [];

    const query = normalizeForQuery(raw);
    if (!query) return [];

    return popularWines
      .map((name) => {
        const normalized = normalizeForName(name);
        const score = scoreMatch(normalized, query);
        return { name, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.name);
  }, [wineName]);

  const handleSelect = (name: string) => {
    // IME確定イベントによるonChangeを無視するフラグをセット
    isSelectingRef.current = true;
    sheetInputRef.current?.blur();
    setWineName(name);
    setHideSuggestions(true);
    // IMEのすべてのイベントが落ち着いた後にフラグをリセット
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleNext = () => {
    if (!onNext) return;
    onNext(wineName.trim());
  };

  const totalSteps = 10;
  const currentStep =
    stepIndex != null ? Math.max(0, Math.min(totalSteps - 1, stepIndex - 1)) : 0;

  const header = (
    <div className="w-full shrink-0 flex flex-col items-center gap-8 pb-0">
      <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
        このワインの名前は？
      </p>
      <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
        <label
          className="absolute left-1/2 -translate-x-1/2 top-1 text-[11px] tracking-wide text-center text-[#aca3a3] pointer-events-none font-normal origin-center"
        >
          ワイン名を入力
        </label>
        <input
          ref={sheetInputRef}
          type="text"
          value={wineName}
          onChange={(e) => {
            if (isSelectingRef.current) return;
            setWineName(e.target.value);
            setActiveIndex(0);
            setHideSuggestions(false);
          }}
          onCompositionUpdate={() => {
            const val = sheetInputRef.current?.value ?? "";
            setWineName(val);
            setActiveIndex(0);
            setHideSuggestions(false);
          }}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            // 戻るボタン等への意図的なフォーカス遷移は除外
            const related = e.relatedTarget as HTMLElement | null;
            if (related && (related.tagName === "BUTTON" || related.tagName === "A")) {
              return;
            }
            // 状態反映後にチェックして遷移
            setTimeout(() => {
              if (!sheetInputRef.current?.isConnected) return;
              if (wineName.trim()) handleNext();
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
      stepIndex={currentStep + 1}
      onBack={handleBack}
      header={header}
      hideNextButton
    >
      {/* 可変コンテンツ（サジェスト） */}
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
                id="suggestions-list"
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

