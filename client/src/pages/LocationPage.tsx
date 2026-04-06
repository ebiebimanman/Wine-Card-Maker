import { useLocation } from "wouter";
import { LocationQuestionScreen } from "@/components/LocationQuestionScreen";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";

export default function LocationPage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin } = useFlowParams();

  return (
    <LocationQuestionScreen
      stepIndex={6}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      onNext={(location) => {
        setLocation(
          `/price${buildFlowQuery({
            theme,
            name,
            variety,
            origin,
            location,
          })}`
        );
      }}
    />
  );
}
