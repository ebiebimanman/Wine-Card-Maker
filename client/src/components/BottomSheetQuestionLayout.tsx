import React from "react";
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
import { useBottomInset } from "@/hooks/useBottomInset";
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

export const BottomSheetQuestionLayout: React.FC<
  BottomSheetQuestionLayoutProps
> = ({
  stepIndex,
  onBack,
  hideBackButton = false,
  wineImageSrc = "/wine-bottle.png",
  isOpen,
  header,
  children,
  onNext,
  nextDisabled = false,
}) => {
  useBottomInset();

  const totalSteps = 9;
  const currentDot = Math.max(0, Math.min(totalSteps - 1, stepIndex - 2));
  const ActiveIcon = STEP_ICONS[stepIndex] ?? Wine;

  return (
    <div className="min-h-screen w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]">
      <div className="relative w-full h-dvh bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <motion.div
          layout
          className="relative flex items-center justify-center pt-8 pb-1"
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
          layout
          className="pt-4 flex justify-center w-full"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="h-[376px] flex items-center justify-center w-full">
            {wineImageSrc === "/wine-glass.png" ? (
              <img
                src={wineImageSrc}
                alt="Wine glass"
                className="h-[280px] w-auto object-contain"
              />
            ) : (
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
            )}
          </div>
        </motion.div>

        {/* 下部パネル（カード + つぎへボタン） */}
        <motion.div
          layout
          className={cn(
            "absolute left-0 right-0 w-full overflow-hidden rounded-t-[32px] px-0 flex flex-col bg-[#fffbf1] shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)]",
            isOpen ? "top-0 bottom-0" : "bottom-0 h-fit",
          )}
          transition={{ layout: { duration: 0.4, ease: "easeOut" } }}
        >
          <motion.div
            layout
            layoutId="bottom-sheet-panel"
            className={cn(
              "relative w-full rounded-none px-8 pt-12 pb-0 flex flex-col gap-2 items-center",
              isOpen ? "flex-1 min-h-0" : "",
            )}
            transition={{ layout: { duration: 0.35, ease: "easeOut" } }}
          >
            {header}
            {children}
          </motion.div>
          <motion.div layout="position" className="relative z-10">
            <NextFooterButton onNext={onNext} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

