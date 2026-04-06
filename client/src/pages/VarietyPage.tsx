import { useLocation } from "wouter";
import { VarietyQuestionScreen } from "@/components/VarietyQuestionScreen";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function VarietyPage() {
  const [, setLocation] = useLocation();
  const { theme, name, origin } = useFlowParams();

  return (
    <VarietyQuestionScreen
      stepIndex={5}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      onNext={(variety) => {
        setLocation(
          `/location${buildFlowQuery({
            theme,
            name,
            origin,
            variety,
          })}`
        );
      }}
    />
  );
}
