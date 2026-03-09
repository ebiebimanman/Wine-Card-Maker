import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Wine } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularWines } from "@/data/popularWines";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBottomInset } from "@/hooks/useBottomInset";
import { NextFooterButton } from "@/components/QuestionScreenLayout";

// ローマ字 → ひらがなの簡易変換（主要なパターンのみ対応）
const romanToHiragana = (input: string): string => {
  const lower = input.toLowerCase();
  const map: Record<string, string> = {
    kya: "きゃ",
    kyu: "きゅ",
    kyo: "きょ",
    sha: "しゃ",
    shu: "しゅ",
    sho: "しょ",
    cha: "ちゃ",
    chu: "ちゅ",
    cho: "ちょ",
    nya: "にゃ",
    nyu: "にゅ",
    nyo: "にょ",
    hya: "ひゃ",
    hyu: "ひゅ",
    hyo: "ひょ",
    mya: "みゃ",
    myu: "みゅ",
    myo: "みょ",
    rya: "りゃ",
    ryu: "りゅ",
    ryo: "りょ",
    gya: "ぎゃ",
    gyu: "ぎゅ",
    gyo: "ぎょ",
    ja: "じゃ",
    ju: "じゅ",
    jo: "じょ",
    bya: "びゃ",
    byu: "びゅ",
    byo: "びょ",
    pya: "ぴゃ",
    pyu: "ぴゅ",
    pyo: "ぴょ",
    shi: "し",
    chi: "ち",
    tsu: "つ",
    fu: "ふ",
  };

  const consonantVowel: Record<string, string> = {
    a: "あ",
    i: "い",
    u: "う",
    e: "え",
    o: "お",
    ka: "か",
    ki: "き",
    ku: "く",
    ke: "け",
    ko: "こ",
    sa: "さ",
    si: "し",
    su: "す",
    se: "せ",
    so: "そ",
    ta: "た",
    ti: "ち",
    tu: "つ",
    te: "て",
    to: "と",
    na: "な",
    ni: "に",
    nu: "ぬ",
    ne: "ね",
    no: "の",
    ha: "は",
    hi: "ひ",
    hu: "ふ",
    he: "へ",
    ho: "ほ",
    ma: "ま",
    mi: "み",
    mu: "む",
    me: "め",
    mo: "も",
    ya: "や",
    yu: "ゆ",
    yo: "よ",
    ra: "ら",
    ri: "り",
    ru: "る",
    re: "れ",
    ro: "ろ",
    wa: "わ",
    wo: "を",
    ga: "が",
    gi: "ぎ",
    gu: "ぐ",
    ge: "げ",
    go: "ご",
    za: "ざ",
    zi: "じ",
    zu: "ず",
    ze: "ぜ",
    zo: "ぞ",
    da: "だ",
    di: "ぢ",
    du: "づ",
    de: "で",
    do: "ど",
    ba: "ば",
    bi: "び",
    bu: "ぶ",
    be: "べ",
    bo: "ぼ",
    pa: "ぱ",
    pi: "ぴ",
    pu: "ぷ",
    pe: "ぺ",
    po: "ぽ",
  };

  let i = 0;
  let result = "";
  while (i < lower.length) {
    // 撥音「ん」
    if (lower[i] === "n") {
      const next = lower[i + 1];
      if (!next || !"aiueony".includes(next)) {
        result += "ん";
        i += 1;
        continue;
      }
    }

    // 3 文字パターン
    const tri = lower.slice(i, i + 3);
    if (map[tri]) {
      result += map[tri];
      i += 3;
      continue;
    }

    // 2 文字パターン
    const bi = lower.slice(i, i + 2);
    if (consonantVowel[bi]) {
      result += consonantVowel[bi];
      i += 2;
      continue;
    }

    // 1 文字（母音）
    const single = lower[i];
    if (consonantVowel[single]) {
      result += consonantVowel[single];
      i += 1;
      continue;
    }

    // 変換できないものはそのまま
    result += lower[i];
    i += 1;
  }

  return result;
};

// ひらがな → カタカナ変換（その他の文字はそのまま）
const toKatakana = (input: string): string => {
  const HIRAGANA_START = 0x3041;
  const HIRAGANA_END = 0x3096;
  const KATAKANA_START = 0x30a1;
  const offset = KATAKANA_START - HIRAGANA_START;

  return Array.from(input).map((ch) => {
    const code = ch.charCodeAt(0);
    if (code >= HIRAGANA_START && code <= HIRAGANA_END) {
      return String.fromCharCode(code + offset);
    }
    return ch;
  }).join("");
};

// 全角英数字 → 半角、英字は小文字化し、カタカナ基準にそろえる
const normalizeForName = (input: string): string => {
  const fullwidthOffset = 0xfee0;
  const converted = Array.from(input).map((ch) => {
    const code = ch.charCodeAt(0);
    // 全角 0-9 A-Z a-z
    if (
      (code >= 0xff10 && code <= 0xff19) ||
      (code >= 0xff21 && code <= 0xff3a) ||
      (code >= 0xff41 && code <= 0xff5a)
    ) {
      return String.fromCharCode(code - fullwidthOffset);
    }
    return ch;
  }).join("");

  return toKatakana(converted.toLowerCase());
};

// クエリ側の正規化（ローマ字 → かな → カタカナも含む）
const normalizeForQuery = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return "";

  // ローマ字だけならローマ字 → ひらがな
  if (/^[a-zA-Z]+$/.test(trimmed)) {
    const hira = romanToHiragana(trimmed);
    return normalizeForName(hira);
  }

  return normalizeForName(trimmed);
};

// マッチスコア（先頭一致 > 単語先頭一致 > その他部分一致）
const scoreMatch = (target: string, query: string): number => {
  const index = target.indexOf(query);
  if (index === -1) return 0;
  if (index === 0) return 3;
  const prev = target[index - 1];
  if (prev === " " || prev === "・" || prev === "-" || prev === "　") {
    return 2;
  }
  return 1;
};

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
    const raw = wineName.trim();
    if (!raw) {
      return popularWines.slice(0, 10);
    }

    const query = normalizeForQuery(raw);
    if (!query) {
      return popularWines.slice(0, 10);
    }

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
    // IME の未確定文字が後ろにくっつかないように、先にフォーカスを外す
    sheetInputRef.current?.blur();
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
      <div className="relative w-full h-screen bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <motion.div
          layout
          className="relative flex items-center justify-center pt-8 pb-1"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
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
        </motion.div>

        {/* ワインボトル画像エリア */}
        <motion.div
          layout
          className="pt-4 flex justify-center w-full"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
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
        </motion.div>

        {/* 下部パネル（カード + 16px スペーサ + つぎへボタン） */}
        <motion.div
          layout
          className={cn(
            "absolute left-0 right-0 w-full overflow-hidden rounded-t-[32px] px-0 flex flex-col",
            isOpen ? "top-0 bottom-0" : "bottom-0 h-fit",
          )}
          transition={{ layout: { duration: 0.4, ease: "easeOut" } }}
        >
          <motion.div
            layout
            layoutId="name-bottom-panel"
            className={cn(
              "relative w-full bg-[#fffbf1] rounded-none shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)] px-8 pt-12 pb-0 flex flex-col gap-2 items-center",
              isOpen ? "flex-1 min-h-0" : "",
            )}
            transition={{ layout: { duration: 0.35, ease: "easeOut" } }}
          >
            {/* 固定ヘッダー（タイトル + TextInput）— flex + gap で間隔 32px を明示 */}
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
                このワインの名前は？
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
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
                />
              </motion.div>
            </motion.div>

            {/* 可変コンテンツ（サジェスト） */}
            {isOpen && suggestions.length > 0 && (
              <motion.div
                layout
                className="w-full flex-1 min-h-0 flex flex-col self-stretch pb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* 1. シャドウ付きカードを ScrollArea の外側に出す */}
                <div className="pt-2 pb-0">
                  <div className="mb-4 flex-1 min-h-0 overflow-hidden rounded-2xl bg-[#fffbf1] ring-1 ring-[#e0d8c8]/50 shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]">
                    {/* 2. 内側だけを ScrollArea でスクロールさせる */}
                    <ScrollArea className="flex-1 w-full">
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
                    </ScrollArea>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
          <motion.div layout="position" className="relative z-10">
            <NextFooterButton onNext={handleNext} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

