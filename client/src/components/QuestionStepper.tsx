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
  { Icon: Palette },
  { Icon: Type },
  { Icon: Wine },
  { Icon: MapPin },
  { Icon: Store },
  { Icon: JapaneseYen },
  { Icon: Star },
  { Icon: MessageSquare },
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
