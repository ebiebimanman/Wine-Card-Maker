import React from "react";
import {
  Palette,
  Type,
  Wine,
  MapPin,
  Store,
  JapaneseYen,
  Star,
  MessageSquare,
  CircleCheck,
} from "lucide-react";

const STEPPER_ICONS = [
  // 1: ワインの名前
  { Icon: Type },
  // 2: 種類
  { Icon: Palette },
  // 3: 産地
  { Icon: MapPin },
  // 4: 品種
  { Icon: Wine },
  // 5: 買った場所
  { Icon: Store },
  // 6: 値段
  { Icon: JapaneseYen },
  // 7: 評価
  { Icon: Star },
  // 8: メモ
  { Icon: MessageSquare },
  // 9: 最終確認
  { Icon: CircleCheck },
] as const;

interface QuestionStepperProps {
  currentStep: number;
  totalSteps?: number;
}

export function QuestionStepper({
  currentStep,
  totalSteps = 9,
}: QuestionStepperProps) {
  const items = STEPPER_ICONS.slice(0, totalSteps);

  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`ステップ ${currentStep} / ${totalSteps}`}
    >
      {items.map(({ Icon }, index) => {
        const step = index + 1;
        const isActive = step <= currentStep;
        return (
          <span
            key={step}
            className="flex items-center justify-center"
            aria-current={step === currentStep ? "step" : undefined}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? "text-[#4b6c3d]" : "text-[#4b6c3d]/40"
              }`}
              strokeWidth={2}
              aria-hidden
            />
          </span>
        );
      })}
    </div>
  );
}
