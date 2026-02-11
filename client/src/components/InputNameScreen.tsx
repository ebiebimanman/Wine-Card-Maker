import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Wine } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularWines } from "@/data/popularWines";

interface InputNameScreenProps {
  /**
   * ワインボトル画像のパス。
   * 例: "/wine-bottle.png"
   */
  wineImageSrc?: string;
  /** 戻るボタン押下時のハンドラ */
  onBack?: () => void;
  /** つぎへボタン押下時のハンドラ（入力されたワイン名を渡す） */
  onNext?: (wineName: string) => void;
}

export const InputNameScreen: React.FC<InputNameScreenProps> = ({
  wineImageSrc = "/wine-bottle.png",
  onBack,
  onNext,
}) => {
  const [wineName, setWineName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    const q = wineName.trim();
    if (!q) {
      // 何も入力していないときは人気ワインの上位を表示
      return popularWines.slice(0, 6);
    }
    const lower = q.toLowerCase();
    const filtered = popularWines.filter((name) =>
      name.toLowerCase().includes(lower)
    );
    return filtered.slice(0, 8);
  }, [wineName]);

  const handleSelect = (name: string) => {
    setWineName(name);
    setIsFocused(false);
  };

  const hasText = wineName.trim().length > 0;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#f5f1e8]">
      <div className="relative w-full h-[844px] bg-[#f5f1e8] overflow-hidden">
        {/* 上部ナビゲーション（戻る + ステッパー） */}
        <div className="relative pt-6 px-6 pb-0 flex items-center justify-center w-full">
          {/* 戻るボタン: 絶対位置（top=13px, left=0） */}
          <button
            type="button"
            className="absolute top-[13px] left-0 w-11 h-11 flex items-center justify-center rounded-full text-[#4b6c3d]"
            aria-label="戻る"
            onClick={() => {
              if (onBack) {
                onBack();
              } else if (window.history.length > 1) {
                window.history.back();
              }
            }}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>

          {/* ステッパー: ドット + ワインアイコン + ドット×8（デザイン準拠） */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4b6c3d]/70" />
            <Wine className="w-5 h-5 text-[#4b6c3d]" strokeWidth={2} />
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-[#4b6c3d]/70"
              />
            ))}
          </div>
        </div>

        {/* ワインボトル画像エリア - WineBottleArea padding [16,0,0,0], height 376 */}
        <div className="pt-4 flex justify-center w-full">
          <div className="h-[376px] flex items-center justify-center w-full">
            <div className="w-[250px] h-[340px] flex items-center justify-center">
              <div className="-rotate-[23deg]">
                <div className="w-[130px] h-[330px] bg-[#111827] rounded-[40px] overflow-hidden shadow-xl flex items-center justify-center">
                  {/* 実際のボトル画像を使う場合は src を差し替え */}
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

        {/* ダイアログカード - 下部固定、角丸・overflow 指定 */}
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
                    (isFocused || hasText)
                      ? "top-1 text-[11px] tracking-wide"
                      : "top-1/2 -translate-y-1/2"
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
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (!suggestions.length) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev + 1 < suggestions.length ? prev + 1 : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev - 1 >= 0 ? prev - 1 : suggestions.length - 1
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      handleSelect(suggestions[activeIndex]);
                    } else if (e.key === "Escape") {
                      setIsFocused(false);
                    }
                  }}
                  placeholder=""
                  className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
                />
              </div>

              {isFocused && suggestions.length > 0 && (
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
                          : "text-[#5c5246] hover:bg-[#f5f1e8]"
                      )}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* つぎへボタン行（緑バー全体がタップ可能） */}
          <button
            type="button"
            className="w-full pt-4 px-8 pb-16 flex items-center justify-center gap-2 text-[#f5f1e8] bg-[#4b6c3d] cursor-pointer border-0"
            onClick={() => {
              if (onNext) {
                onNext(wineName);
              }
            }}
          >
            <span className="text-[16px] font-bold">つぎへ</span>
            <ChevronRight className="w-6 h-6 text-[#f5f1e8]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

