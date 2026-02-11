import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuestionStepper } from "./QuestionStepper";

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
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#f5f1e8]">
      <div className="relative w-full h-[844px] bg-[#f5f1e8] overflow-hidden">
        {/* 上部ナビゲーション（戻る + ステッパー） */}
        <div className="relative pt-6 px-6 pb-0 flex items-center justify-center w-full">
          <button
            type="button"
            className="absolute top-[13px] left-0 w-11 h-11 flex items-center justify-center rounded-full text-[#4b6c3d]"
            aria-label="戻る"
            onClick={onBack}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>

          <QuestionStepper currentStep={stepIndex} totalSteps={9} />
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
