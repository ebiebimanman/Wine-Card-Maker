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
        // TODO: 次のステップのパスが決まったらここで遷移
        console.log("次へ: 入力されたワイン名", name);
        alert("次の画面の遷移はまだ実装していません。\nコンソールにワイン名を出力しています。");
      }}
    />
  );
}
