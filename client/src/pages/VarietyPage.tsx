import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";
import { wineVarieties } from "@/data/wineVarieties";

export default function VarietyPage() {
  const [, setLocation] = useLocation();
  const { theme, name } = useFlowParams();
  const [variety, setVariety] = useState("");
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return wineVarieties.slice(0, 12);
    return wineVarieties.filter((s) => s.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);

  const handleSelect = (value: string) => {
    setVariety(value);
    setIsFocused(false);
  };

  return (
    <QuestionScreenLayout
      stepIndex={3}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="品種は？"
      onNext={() => {
        setLocation(`/origin${buildFlowQuery({ theme, name, variety })}`);
      }}
      nextDisabled={!variety.trim()}
    >
      <div className="w-full gap-2 flex flex-col">
        <div className="relative w-full h-16 rounded-[16px] bg-[#f5f1e8] flex items-center justify-center px-4">
          <input
            type="text"
            value={isFocused ? search : variety}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
              if (!isFocused) setVariety("");
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onKeyDown={(e) => {
              if (!filtered.length) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => (i + 1 < filtered.length ? i + 1 : 0));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => (i - 1 >= 0 ? i - 1 : filtered.length - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                handleSelect(filtered[activeIndex]);
              }
            }}
            placeholder="品種を入力または選択"
            className="w-full bg-transparent text-center text-[16px] text-[#2c2c2c] outline-none"
          />
        </div>
        {isFocused && filtered.length > 0 && (
          <ul className="w-full max-h-48 overflow-y-auto rounded-2xl border border-[#e0d8c8] bg-[#fffbf1] shadow-sm">
            {filtered.map((item, index) => (
              <li
                key={item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer text-left transition-colors",
                  index === activeIndex
                    ? "bg-[#f5f1e8] text-[#2c2c2c]"
                    : "text-[#5c5246] hover:bg-[#f5f1e8]"
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </QuestionScreenLayout>
  );
}
