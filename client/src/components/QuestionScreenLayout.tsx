import React from "react";
import { ChevronLeft, ChevronRight, Wine } from "lucide-react";

interface QuestionScreenLayoutProps {
  /** 現在のステップ（1〜9、ステッパーのハイライトに使用） */
  stepIndex: number;
  /** 戻るボタン押下時 */
  onBack: () => void;
  /** 白カード内の質問タイトル */
  title: string;
  /** 白カード内のコンテンツ */
  children: React.ReactNode;
  /** つぎへ押下時 */
  onNext: () => void;
  /** つぎへを無効にするか（未入力時など） */
  nextDisabled?: boolean;
}

export function QuestionScreenLayout({
  stepIndex,
  onBack,
  title,
  children,
  onNext,
  nextDisabled = false,
}: QuestionScreenLayoutProps) {
  const totalSteps = 9;
  const currentStep = Math.max(0, Math.min(totalSteps - 1, stepIndex - 1));

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#f5f1e8]">
      <div className="relative w-full h-[844px] bg-[#f5f1e8] overflow-hidden">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <div className="relative flex items-center justify-center py-1">
          {/* Back button - absolutely positioned at left 32px */}
          <button
            onClick={onBack}
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

        {/* 下部パネル（白カード + 緑つぎへ） */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-fit overflow-hidden rounded-t-[32px] px-0">
          <div className="w-full bg-[#fffbf1] rounded-none shadow-[0_8px_24px_-8px_rgba(75,108,61,0.2)] px-8 py-12 flex flex-col gap-8 items-center">
            <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
              {title}
            </p>
            <div className="w-full flex flex-col gap-2 items-center">
              {children}
            </div>
          </div>
          <button
            type="button"
            className="w-full pt-4 px-8 pb-16 flex items-center justify-center gap-2 text-[#f5f1e8] bg-[#4b6c3d] cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onNext}
            disabled={nextDisabled}
          >
            <span className="text-[16px] font-bold">つぎへ</span>
            <ChevronRight className="w-6 h-6 text-[#f5f1e8]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
