import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Wine } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularWines } from "@/data/popularWines";

interface NameQuestionScreenProps {
  /** ワインボトル画像のパス */
  wineImageSrc?: string;
  /** 現在のステップ番号（1〜9） */
  stepIndex?: number;
  /** 戻るボタン押下時 */
  onBack?: () => void;
  /** つぎへボタン押下時（入力されたワイン名を渡す） */
  onNext?: (wineName: string) => void;
}

export const NameQuestionScreen: React.FC<NameQuestionScreenProps> = ({
  wineImageSrc = "/wine-bottle.png",
  stepIndex = 1,
  onBack,
  onNext,
}) => {
  const [wineName, setWineName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasText = wineName.trim().length > 0;

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

  const totalSteps = 9;
  const currentStep =
    stepIndex != null ? Math.max(0, Math.min(totalSteps - 1, stepIndex - 1)) : 0;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#f5f1e8]">
      <div className="relative w-full h-[844px] bg-[#f5f1e8] overflow-hidden">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <div className="relative flex items-center justify-center py-1">
          {/* Back button - absolutely positioned at left 32px */}
          <button
            onClick={handleBack}
            className="text-[#4b6c3d] absolute left-0 flex items-center justify-center p-1 transition-colors hover:opacity-70"
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
              <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
                <label
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 text-center text-[#aca3a3] pointer-events-none transition-all duration-200 text-[14px] font-normal",
                    "origin-center",
                    hasText || isOpen
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
                  onBlur={() => {
                    // クリック選択のために少し遅らせて閉じる
                    setTimeout(() => setIsOpen(false), 100);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
                />
              </div>

              {isOpen && suggestions.length > 0 && (
                <ul className="w-full max-h-48 overflow-y-auto rounded-2xl border border-[#e0d8c8] bg-[#fffbf1] shadow-sm">
                  {suggestions.map((name, index) => (
                    <li
                      key={`${name}-${index}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(name);
                      }}
                      className={cn(
                        "px-4 py-2 text-sm cursor-pointer text-left transition-colors",
                        index === activeIndex
                          ? "bg-[#f5f1e8] text-[#2c2c2c]"
                          : "text-[#5c5246] hover:bg-[#f5f1e8]",
                      )}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            type="button"
            className={cn(
              "w-full pt-4 px-8 pb-16 flex items-center justify-center gap-2 text-[#f5f1e8] bg-[#4b6c3d] cursor-pointer border-0",
              !hasText && "opacity-50 cursor-not-allowed",
            )}
            onClick={handleNext}
            disabled={!hasText}
          >
            <span className="text-[16px] font-bold">つぎへ</span>
            <ChevronRight className="w-6 h-6 text-[#f5f1e8]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

