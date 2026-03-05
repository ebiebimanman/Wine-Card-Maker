import React from "react";
import { NameQuestionScreen } from "./NameQuestionScreen";

interface InputNameScreenProps {
  wineImageSrc?: string;
  stepIndex?: number;
  onBack?: () => void;
  onNext?: (wineName: string) => void;
}

export const InputNameScreen: React.FC<InputNameScreenProps> = ({
  wineImageSrc = "/wine-bottle.png",
  stepIndex = 1,
  onBack,
  onNext,
}) => {
  return (
    <NameQuestionScreen
      wineImageSrc={wineImageSrc}
      stepIndex={stepIndex}
      onBack={onBack}
      onNext={onNext}
    />
  );
};

