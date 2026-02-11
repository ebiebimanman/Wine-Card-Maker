import { InputNameScreen } from "@/components/InputNameScreen";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <InputNameScreen
      onBack={() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          setLocation("/");
        }
      }}
      onNext={(name) => {
        const q = new URLSearchParams({ name: name || "" }).toString();
        setLocation(`/rating${q ? `?${q}` : ""}`);
      }}
    />
  );
}
