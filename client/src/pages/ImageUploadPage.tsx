import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { Camera, ArrowRight } from "lucide-react";
import { setWineCardImage } from "@/hooks/useWineCardImage";


export default function ImageUploadPage() {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // フロー開始時にシートの開閉フラグをリセット
  try { sessionStorage.removeItem("wineSheetOpen"); } catch {}

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setIsProcessing(true);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      setWineCardImage(dataUrl);
      setLocation("/name");
    } catch (err) {
      console.error("Background removal failed, using original:", err);
      const reader = new FileReader();
      reader.onload = () => {
        setWineCardImage(reader.result as string);
        setLocation("/name");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    setWineCardImage("/wine-glass.png");
    setLocation("/name");
  };

  return (
    <div className="w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]" style={{ height: '100dvh' }}>
      <div
        className="relative w-full bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto flex flex-col items-center justify-between px-6"
        style={{ height: '100%', paddingTop: 'clamp(24px, 8dvh, 64px)', paddingBottom: 'clamp(24px, 8dvh, 64px)' }}
      >
        {/* WINE テキスト */}
        <h1
          className="tracking-widest text-[#2c2c2c] text-center leading-none"
          style={{ fontFamily: "'Goblin One', 'Playfair Display', serif", fontSize: 'clamp(24px, 5dvh, 40px)' }}
        >
          WINE
        </h1>

        {/* ワイングラスイラスト */}
        <div className="flex items-center justify-center flex-1">
          <img
            src="/wine-glass.png"
            alt="Wine glass"
            style={{ height: 'clamp(120px, 23dvh, 196px)', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* DIARY テキスト */}
        <h2
          className="tracking-widest text-[#2c2c2c] text-center leading-none"
          style={{ fontFamily: "'Goblin One', 'Playfair Display', serif", fontSize: 'clamp(24px, 5dvh, 40px)', marginBottom: 'clamp(16px, 4dvh, 48px)' }}
        >
          DIARY
        </h2>

        {/* ボタンエリア */}
        <div className="w-full flex flex-col gap-4 items-center">
          {/* ワインの写真を撮るボタン */}
          <label className={`w-full ${isProcessing ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="sr-only"
              aria-label="ワインの画像を選択"
            />
            <span className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-[64px] bg-[#4b6c3d] text-[#f5f1e8] text-[16px] font-bold hover:opacity-90 transition-opacity">
              <Camera className="w-5 h-5 flex-shrink-0" />
              {isProcessing ? "処理中..." : "ワインの写真を撮る"}
            </span>
          </label>

          {/* 写真はないよリンク */}
          <button
            type="button"
            onClick={handleSkip}
            disabled={isProcessing}
            className="flex items-center gap-2 py-3 px-4 text-[14px] font-bold text-[#2c2c2c] hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            写真はないよ
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
