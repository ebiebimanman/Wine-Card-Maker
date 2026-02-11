import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { buildFlowQuery } from "@/hooks/useFlowParams";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "red", label: "赤" },
  { value: "white", label: "白" },
  { value: "rose", label: "ロゼ" },
  { value: "other", label: "その他" },
] as const;

export default function ThemePage() {
  const [, setLocation] = useLocation();
  const [theme, setTheme] = useState<string>("");

  return (
    <QuestionScreenLayout
      stepIndex={1}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="ワインの種類は？"
      onNext={() => setLocation(`/name${buildFlowQuery({ theme })}`)}
      nextDisabled={!theme}
    >
      <div className="w-full flex flex-wrap justify-center gap-3">
        {THEMES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "px-6 py-3 rounded-[16px] text-[16px] font-medium transition-colors",
              theme === value
                ? "bg-[#4b6c3d] text-[#f5f1e8]"
                : "bg-[#f5f1e8] text-[#2c2c2c] hover:bg-[#e8e2d8]"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </QuestionScreenLayout>
  );
}
