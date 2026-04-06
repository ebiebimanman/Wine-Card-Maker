import { useLocation } from "wouter";
import { OriginQuestionScreen } from "@/components/OriginQuestionScreen";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function OriginPage() {
  const [, setLocation] = useLocation();
  const { theme, name } = useFlowParams();

  return (
    <OriginQuestionScreen
      stepIndex={4}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      onNext={(origin) => {
        setLocation(`/variety${buildFlowQuery({ theme, name, origin })}`);
      }}
    />
  );
}
