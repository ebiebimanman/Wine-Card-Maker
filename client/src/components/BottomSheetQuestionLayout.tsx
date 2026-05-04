import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";
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
  /** ワインボトル画像のパス */
  wineImageSrc?: string;
  /** シートを開いているか（フォーカス中など） */
  isOpen: boolean;
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
  wineImageSrc = "/wine-glass.png",
  isOpen,
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
    /*
     * position: fixed + visualViewport による top/height 指定で、
     * iOS Safari のキーボード表示時にも正確にビューポートを埋める。
     * sm: ブレークポイント以上は中央揃え・最大幅でデスクトップ表示。
     */
    <div
      className="fixed left-0 right-0 w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]"
      style={{ top: vp.top, height: vp.height }}
    >
      <div className="relative w-full bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto h-full">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <motion.div
          className="relative flex items-center justify-center pt-12 pb-1"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {!hideBackButton && (
            <button
              onClick={onBack}
              className="text-[#4b6c3d] absolute left-8 flex items-center justify-center p-1 transition-colors hover:opacity-70"
              aria-label="戻る"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Centered progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index}>
                {index === currentDot ? (
                  <div className="bg-[#4b6c3d] flex size-8 items-center justify-center rounded-full border-[3px] border-[#f5f1e8] shadow-sm">
                    <ActiveIcon className="text-[#f5f1e8] size-4" />
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
        </motion.div>

        {/* ワインボトル画像エリア */}
        <motion.div
          className="pt-4 flex justify-center w-full"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="h-[376px] flex items-center justify-center w-full">
            <img
              src="/wine-glass.png"
              alt="Wine glass"
              className="h-[280px] w-auto object-contain"
            />
          </div>
        </motion.div>

        {/* 下部パネル（カード + つぎへボタン） */}
        <div
          className={cn(
            "absolute left-0 right-0 w-full overflow-hidden rounded-t-[32px] px-0 flex flex-col bg-[#fffbf1] shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]",
            isOpen ? "top-0 bottom-0" : "bottom-0 h-fit",
          )}
        >
          <div
            className={cn(
              "relative w-full rounded-none px-8 pt-20 pb-0 flex flex-col gap-2 items-center",
              isOpen ? "flex-1 min-h-0" : "",
            )}
          >
            {/* シート内の戻るボタン + プログレスドット（isOpen時のみ表示） */}
            {isOpen && (
              <div className="absolute top-8 left-0 right-0 flex items-center justify-center px-4">
                {!hideBackButton && (
                  <button
                    onClick={onBack}
                    className="absolute left-8 text-[#4b6c3d] flex items-center justify-center p-1 transition-colors hover:opacity-70"
                    aria-label="戻る"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                )}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index}>
                      {index === currentDot ? (
                        <div className="bg-[#4b6c3d] flex size-6 items-center justify-center rounded-full border-[2px] border-[#fffbf1] shadow-sm">
                          <ActiveIcon className="text-[#fffbf1] size-3" />
                        </div>
                      ) : (
                        <div
                          className={`size-2 rounded-full ${
                            index < currentDot ? "bg-[#4b6c3d]/40" : "bg-[#4b6c3d]/10"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {header}
            {children}
          </div>
          <div className="relative z-10">
            <NextFooterButton onNext={onNext} />
          </div>
        </div>
      </div>
    </div>
  );
};
