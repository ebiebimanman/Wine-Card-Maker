import React from "react";
import { ChevronLeft, ChevronRight, Wine } from "lucide-react";
import { useBottomInset } from "@/hooks/useBottomInset";

interface QuestionScreenLayoutProps {
  /** 現在のステップ（1〜10、ステッパーのハイライトに使用） */
  stepIndex: number;
  /** 戻るボタン押下時（hideBackButton のときは不要） */
  onBack: () => void;
  /** 1ページ目など戻るボタンを非表示にする */
  hideBackButton?: boolean;
  /** 白カード内の質問タイトル */
  title: string;
  /** 白カード内のコンテンツ */
  children: React.ReactNode;
  /** つぎへ押下時 */
  onNext: () => void;
  /** つぎへを無効にするか（未入力時など） */
  nextDisabled?: boolean;
  /** ワインボトル画像のパス（NameQuestionScreen と同じデザイン用） */
  wineImageSrc?: string;
}

interface NextFooterButtonProps {
  onNext: () => void;
  disabled?: boolean;
}

export function NextFooterButton({
  onNext,
  disabled = false,
}: NextFooterButtonProps) {
  return (
    <button
      type="button"
      className="w-full min-h-[64px] py-4 px-8 flex items-center justify-center gap-2 text-[#f5f1e8] bg-[#4b6c3d] cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed pb-[max(1rem,env(safe-area-inset-bottom,0px),var(--browser-bottom-inset,0px))]"
      onClick={onNext}
      disabled={disabled}
    >
      <span className="text-[16px] font-bold">つぎへ</span>
      <ChevronRight className="w-6 h-6 text-[#f5f1e8]" strokeWidth={2} />
    </button>
  );
}

export function QuestionScreenLayout({
  stepIndex,
  onBack,
  hideBackButton = false,
  title,
  children,
  onNext,
  nextDisabled = false,
  wineImageSrc = "/wine-bottle.png",
}: QuestionScreenLayoutProps) {
  useBottomInset();
  const totalSteps = 10;
  const currentStep = Math.max(0, Math.min(totalSteps - 1, stepIndex - 1));

  return (
    <div className="min-h-screen w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]">
      <div className="relative w-full h-screen bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto">
        {/* 上部ナビゲーション（戻る + プログレスドット） */}
        <div className="relative flex items-center justify-center pt-8 pb-1">
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

        {/* ワインボトル画像エリア（NameQuestionScreen と同じデザイン） */}
        <div className="pt-4 flex justify-center w-full">
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
          <NextFooterButton onNext={onNext} disabled={nextDisabled} />
        </div>
      </div>
    </div>
  );
}
