import { useLocation } from "wouter";
import { InputNameScreen } from "@/components/InputNameScreen";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function NamePage() {
  const [, setLocation] = useLocation();
  const { theme } = useFlowParams();

  return (
    <InputNameScreen
      stepIndex={2}
      onBack={() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          setLocation("/");
        }
      }}
      onNext={(name) => {
        setLocation(`/variety${buildFlowQuery({ theme, name })}`);
      }}
    />
  );
}
