import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { popularWines } from "@/data/popularWines";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";

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
  wineImageSrc = "/wine-glass.png",
  stepIndex = 2,
  onBack,
  onNext,
}) => {
  const [wineName, setWineName] = useState("");
  const isOpen = true;

  const [activeIndex, setActiveIndex] = useState(0);
  const sheetInputRef = useRef<HTMLInputElement>(null);
  // サジェスト選択直後のIME確定イベントを無視するフラグ
  const isSelectingRef = useRef(false);

  const hasText = wineName.trim().length > 0;

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
    <motion.div
      className={cn(
        "w-full shrink-0 flex flex-col items-center gap-8",
        isOpen ? "pb-0" : "pb-12",
      )}
    >
      <motion.p
        className="text-center text-[20px] font-bold text-[#2c2c2c]"
      >
        このワインの名前は？
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
          }}
          onCompositionUpdate={() => {
            const val = sheetInputRef.current?.value ?? "";
            setWineName(val);
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
      stepIndex={currentStep + 1}
      onBack={handleBack}
      isOpen={isOpen}
      wineImageSrc={wineImageSrc}
      onNext={handleNext}
      header={header}
    >
      {/* 可変コンテンツ（サジェスト） */}
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
    </BottomSheetQuestionLayout>
  );
};

