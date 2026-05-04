import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Wine,
  MapPin,
  Grape,
  ShoppingCart,
  JapaneseYen,
  Star,
  MessageSquare,
  CircleCheck,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { NextFooterButton } from "@/components/QuestionScreenLayout";

const STEP_ICONS: Record<number, LucideIcon> = {
  1: Camera,
  2: Wine,
  3: Wine,
  4: MapPin,
  5: Grape,
  6: ShoppingCart,
  7: JapaneseYen,
  8: Star,
  9: MessageSquare,
  10: CircleCheck,
};

interface BottomSheetQuestionLayoutProps {
  /** 現在のステップ（1〜10、ステッパーのハイライトに使用） */
  stepIndex: number;
  /** 戻るボタン押下時（hideBackButton のときは不要） */
  onBack: () => void;
  /** 1ページ目など戻るボタンを非表示にする */
  hideBackButton?: boolean;
  /** 下部シート内の固定ヘッダー（タイトル + TextInput など） */
  header: React.ReactNode;
  /** 下部シート内の可変コンテンツ（サジェストなど） */
  children?: React.ReactNode;
  /** つぎへ押下時 */
  onNext: () => void;
  /** つぎへを無効にするか（未入力時など） */
  nextDisabled?: boolean;
}

/** visualViewport を追跡して、キーボード表示時でも正確なビューポート位置・高さを返す */
function useVisualViewport() {
  const [vp, setVp] = useState(() => ({
    top: 0,
    height: typeof window !== "undefined" ? window.innerHeight : 812,
  }));

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setVp({ top: vv.offsetTop, height: vv.height });
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return vp;
}

export const BottomSheetQuestionLayout: React.FC<
  BottomSheetQuestionLayoutProps
> = ({
  stepIndex,
  onBack,
  hideBackButton = false,
  header,
  children,
  onNext,
  nextDisabled = false,
}) => {
  const vp = useVisualViewport();

  const totalSteps = 9;
  const currentDot = Math.max(0, Math.min(totalSteps - 1, stepIndex - 2));
  const ActiveIcon = STEP_ICONS[stepIndex] ?? Wine;

  return (
    <div
      className="fixed left-0 right-0 w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]"
      style={{ top: vp.top, height: vp.height }}
    >
      <div className="relative w-full bg-[#fffbf1] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto h-full flex flex-col">
        {/* 戻るボタン + プログレスドット */}
        <div className="relative flex items-center justify-center pt-12 pb-1">
          {!hideBackButton && (
            <button
              onClick={onBack}
              className="text-[#4b6c3d] absolute left-8 flex items-center justify-center p-1 transition-colors hover:opacity-70"
              aria-label="戻る"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index}>
                {index === currentDot ? (
                  <div className="bg-[#4b6c3d] flex size-8 items-center justify-center rounded-full border-[3px] border-[#fffbf1] shadow-sm">
                    <ActiveIcon className="text-[#fffbf1] size-4" />
                  </div>
                ) : (
                  <div
                    className={`size-2.5 rounded-full ${
                      index < currentDot
                        ? "bg-[#4b6c3d]/40"
                        : "bg-[#4b6c3d]/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ヘッダー + サジェストなど */}
        <div className="relative w-full px-8 pt-12 pb-0 flex flex-col gap-2 items-center flex-1 min-h-0">
          {header}
          {children}
        </div>

        <NextFooterButton onNext={onNext} disabled={nextDisabled} />
      </div>
    </div>
  );
};
