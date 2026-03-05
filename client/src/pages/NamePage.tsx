import { useLocation } from "wouter";
import { NameQuestionScreen } from "@/components/NameQuestionScreen";
import { buildFlowQuery } from "@/hooks/useFlowParams";

export default function NamePage() {
  const [, setLocation] = useLocation();

  return (
    <NameQuestionScreen
      stepIndex={1}
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
