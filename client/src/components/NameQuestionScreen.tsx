import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Wine } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularWines } from "@/data/popularWines";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBottomInset } from "@/hooks/useBottomInset";

interface NameQuestionScreenProps {
  /** ワインボトル画像のパス */
  wineImageSrc?: string;
  /** 現在のステップ番号（1〜10） */
  stepIndex?: number;
  /** 戻るボタン押下時 */
  onBack?: () => void;
  /** つぎへボタン押下時（入力されたワイン名を渡す） */
  onNext?: (wineName: string) => void;
}

export const NameQuestionScreen: React.FC<NameQuestionScreenProps> = ({
  wineImageSrc = "/wine-bottle.png",
  stepIndex = 2,
  onBack,
  onNext,
}) => {
  const [wineName, setWineName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sheetInputRef = useRef<HTMLInputElement>(null);

  const hasText = wineName.trim().length > 0;

  useEffect(() => {
    if (isOpen) sheetInputRef.current?.focus();
  }, [isOpen]);

  const suggestions = useMemo(() => {
    const q = wineName.trim();
    if (!q) {
      return popularWines.slice(0, 6);
    }
    const lower = q.toLowerCase();
    return popularWines
      .filter((name) => name.toLowerCase().includes(lower))
      .slice(0, 8);
  }, [wineName]);

  const handleSelect = (name: string) => {
    setWineName(name);
    setIsOpen(false);
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

  useBottomInset();

  return (
    <div className="min-h-screen w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="ワイン名を入力"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 flex justify-center bg-[#f5f1e8] sm:py-6 sm:px-4 overflow-hidden"
          >
            <div className="w-full sm:max-w-[480px] sm:rounded-[24px] sm:shadow-2xl bg-[#fffbf1] overflow-hidden flex flex-col pt-12 px-8 h-full sm:h-[calc(100vh-3rem)]">
            <div className="w-full flex flex-col gap-2 flex-1 min-h-0">
              <div className="relative w-full h-16 shrink-0 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
                <label
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 text-center text-[#aca3a3] pointer-events-none transition-all duration-200 text-[14px] font-normal",
                    hasText ? "top-1 text-[11px] tracking-wide" : "top-1/2 -translate-y-1/2",
                  )}
                >
                  ワイン名を入力
                </label>
                <input
                  ref={sheetInputRef}
                  type="text"
                  value={wineName}
                  onChange={(e) => {
                    setWineName(e.target.value);
                    setActiveIndex(0);
                  }}
                  onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
                />
              </div>
              {suggestions.length > 0 && (
                <div className="mt-4 flex-1 min-h-0 flex flex-col overflow-hidden self-start w-full max-h-[calc(100vh-9.5rem)] px-3 py-1 pb-6">
                  <ScrollArea className="h-full w-full">
                    <div className="rounded-2xl bg-[#fffbf1] ring-1 ring-[#e0d8c8]/50 shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]">
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
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative w-full h-screen bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <div className="relative flex items-center justify-center pt-8 pb-1">
          {/* Back button - absolutely positioned at left 32px */}
          <button
            onClick={handleBack}
            className="text-[#4b6c3d] absolute left-8 flex items-center justify-center p-1 transition-colors hover:opacity-70"
            aria-label="戻る"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Centered progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index}>
                {index === currentStep ? (
                  <div className="bg-[#4b6c3d] flex size-8 items-center justify-center rounded-full">
                    <Wine className="text-[#f5f1e8] size-4" />
                  </div>
                ) : (
                  <div
                    className={`size-2.5 rounded-full ${
                      index < currentStep
                        ? "bg-[#4b6c3d]/40"
                        : "bg-[#4b6c3d]/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ワインボトル画像エリア */}
        <div className="pt-4 flex justify-center w-full">
          <div className="h-[376px] flex items-center justify-center w-full">
            <div className="w-[250px] h-[340px] flex items-center justify-center">
              <div className="-rotate-[23deg]">
                <div className="w-[130px] h-[330px] bg-[#111827] rounded-[40px] overflow-hidden shadow-xl flex items-center justify-center">
                  <img
                    src={wineImageSrc}
                    alt="Wine bottle"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 下部カード + つぎへボタン */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-fit overflow-hidden rounded-t-[32px] px-0">
          <div className="w-full bg-[#fffbf1] rounded-none shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)] px-8 py-12 flex flex-col gap-8 items-center">
            <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
              このワインの名前は？
            </p>

            <div className="w-full gap-2 flex flex-col">
              {isOpen ? (
                <div
                  className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4"
                  aria-hidden
                >
                  <span className="text-center text-[16px] text-[#2c2c2c]">
                    {wineName || "タップして入力"}
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
                  <label
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 text-center text-[#aca3a3] pointer-events-none transition-all duration-200 text-[14px] font-normal",
                      "origin-center",
                      hasText
                        ? "top-1 text-[11px] tracking-wide"
                        : "top-1/2 -translate-y-1/2",
                    )}
                  >
                    ワイン名を入力
                  </label>
                  <input
                    type="text"
                    value={wineName}
                    onChange={(e) => {
                      setWineName(e.target.value);
                      setActiveIndex(0);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="w-full min-h-[64px] py-4 px-8 flex items-center justify-center gap-2 text-[#f5f1e8] bg-[#4b6c3d] cursor-pointer border-0 pb-[max(1rem,env(safe-area-inset-bottom,0px),var(--browser-bottom-inset,0px))]"
            onClick={handleNext}
          >
            <span className="text-[16px] font-bold">つぎへ</span>
            <ChevronRight className="w-6 h-6 text-[#f5f1e8]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

