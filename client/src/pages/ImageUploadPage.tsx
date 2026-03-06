import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { setWineCardImage } from "@/hooks/useWineCardImage";

export default function ImageUploadPage() {
  const [, setLocation] = useLocation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];
      if (!file) {
        setPreviewUrl(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("画像ファイルを選んでください");
        setPreviewUrl(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setError("読み込みに失敗しました");
        setPreviewUrl(null);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleNext = () => {
    if (previewUrl) {
      setWineCardImage(previewUrl);
    } else {
      setWineCardImage(null);
    }
    setLocation("/name");
  };

  const handleSkip = () => {
    setWineCardImage(null);
    setPreviewUrl(null);
    setLocation("/name");
  };

  return (
    <QuestionScreenLayout
      stepIndex={1}
      hideBackButton
      onBack={() => setLocation("/")}
      title="ワインの画像をアップロード"
      wineImageSrc={previewUrl ?? "/wine-bottle.png"}
      onNext={handleNext}
    >
      <div className="w-full flex flex-col gap-4 items-center">
        <label className="w-full flex flex-col items-center gap-2 cursor-pointer">
          <span className="text-[14px] text-[#5c5246]">
            タップして写真を選ぶ（任意）
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="ワインの画像を選択"
          />
          <span className="py-3 px-6 rounded-[16px] bg-[#4b6c3d] text-[#f5f1e8] text-[14px] font-medium hover:opacity-90 transition-opacity">
            画像を選ぶ
          </span>
        </label>
        {error && (
          <p className="text-[14px] text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleSkip}
          className="text-[14px] text-[#5c5246] underline hover:opacity-80"
        >
          スキップする
        </button>
      </div>
    </QuestionScreenLayout>
  );
}
