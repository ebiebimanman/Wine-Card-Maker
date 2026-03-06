import { useLocation } from "wouter";
import { NameQuestionScreen } from "@/components/NameQuestionScreen";
import { buildFlowQuery } from "@/hooks/useFlowParams";
import { getWineCardImage } from "@/hooks/useWineCardImage";

export default function NamePage() {
  const [, setLocation] = useLocation();
  const wineImageSrc = getWineCardImage();

  return (
    <NameQuestionScreen
      stepIndex={2}
      wineImageSrc={wineImageSrc ?? undefined}
      onBack={() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          setLocation("/");
        }
      }}
      onNext={(name) => {
        setLocation(`/theme${buildFlowQuery({ name })}`);
      }}
    />
  );
}
