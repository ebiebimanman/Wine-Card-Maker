import { useState } from "react";
import { useLocation } from "wouter";
import { Wine } from "lucide-react";
import { BottomSheetQuestionLayout } from "@/components/BottomSheetQuestionLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";
import { cn } from "@/lib/utils";

const THEME_WINE_COLOR: Record<string, string> = {
  red: "#ad1e1e",
  white: "#c8a84b",
  rose: "#db7093",
  other: "#6b7280",
};

export default function ThemePage() {
  const [, setLocation] = useLocation();
  const { name } = useFlowParams();
  const [theme, setTheme] = useState<string>("");
  const [isSparkling, setIsSparkling] = useState(false);

  const handleNext = () => {
    setLocation(`/origin${buildFlowQuery({ theme, name })}`);
  };

  const header = (
    <div className="w-full shrink-0 flex flex-col items-center gap-8 pb-0">
      <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
        種類は？
      </p>
      <div className="w-full flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setTheme("red")}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-5 px-4 rounded-[16px] text-[16px] font-medium transition-colors",
            theme === "red"
              ? "bg-[#4b6c3d] text-[#f5f1e8]"
              : "bg-[#f5f1e8] text-[#2c2c2c] hover:bg-[#e8e2d8]"
          )}
        >
          <Wine
            className="w-5 h-5 flex-shrink-0"
            style={{ color: theme === "red" ? "#f5f1e8" : THEME_WINE_COLOR.red }}
          />
          赤ワイン
        </button>
        <button
          type="button"
          onClick={() => setTheme("white")}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-5 px-4 rounded-[16px] text-[16px] font-medium transition-colors",
            theme === "white"
              ? "bg-[#4b6c3d] text-[#f5f1e8]"
              : "bg-[#f5f1e8] text-[#2c2c2c] hover:bg-[#e8e2d8]"
          )}
        >
          <Wine
            className="w-5 h-5 flex-shrink-0"
            style={{ color: theme === "white" ? "#f5f1e8" : THEME_WINE_COLOR.white }}
          />
          白ワイン
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTheme("rose")}
            className={cn(
              "flex items-center justify-center gap-2 py-5 px-4 rounded-[16px] text-[16px] font-medium transition-colors",
              theme === "rose"
                ? "bg-[#4b6c3d] text-[#f5f1e8]"
                : "bg-[#f5f1e8] text-[#2c2c2c] hover:bg-[#e8e2d8]"
            )}
          >
            <Wine
              className="w-5 h-5 flex-shrink-0"
              style={{ color: theme === "rose" ? "#f5f1e8" : THEME_WINE_COLOR.rose }}
            />
            ロゼワイン
          </button>
          <button
            type="button"
            onClick={() => setTheme("other")}
            className={cn(
              "flex items-center justify-center gap-2 py-5 px-4 rounded-[16px] text-[16px] font-medium transition-colors",
              theme === "other"
                ? "bg-[#4b6c3d] text-[#f5f1e8]"
                : "bg-[#f5f1e8] text-[#2c2c2c] hover:bg-[#e8e2d8]"
            )}
          >
            <Wine
              className="w-5 h-5 flex-shrink-0"
              style={{ color: theme === "other" ? "#f5f1e8" : THEME_WINE_COLOR.other }}
            />
            その他
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsSparkling((v) => !v)}
          className={cn(
            "w-full flex items-center justify-center gap-3 py-5 px-4 rounded-[24px] border-2 text-[14px] font-medium transition-colors mt-2",
            isSparkling
              ? "border-[#4b6c3d] text-[#4b6c3d] bg-[#4b6c3d]/5"
              : "border-[#ddd8cc] text-[#2c2c2c] bg-transparent hover:border-[#4b6c3d]/40"
          )}
        >
          <span
            className={cn(
              "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors",
              isSparkling ? "border-[#4b6c3d] bg-[#4b6c3d]" : "border-[#aaa]"
            )}
          />
          スパークリング
        </button>
      </div>
    </div>
  );

  return (
    <BottomSheetQuestionLayout
      stepIndex={3}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      onNext={handleNext}
      header={header}
    />
  );
}
