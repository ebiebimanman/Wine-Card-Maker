import { useRef } from "react";
import { useLocation } from "wouter";
import { Camera, ChevronRight } from "lucide-react";
import { setWineCardImage } from "@/hooks/useWineCardImage";

// Figmaデザインに基づくワイングラスSVGイラスト
function WineGlassIllustration() {
  return (
    <svg
      width="160"
      height="200"
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ボウル部分 */}
      <path
        d="M30 20 Q28 80 80 100 Q132 80 130 20 Z"
        fill="#c8c0b0"
        opacity="0.5"
      />
      {/* ワインの液面 */}
      <path
        d="M42 55 Q40 90 80 100 Q120 90 118 55 Z"
        fill="#2c2c2c"
        opacity="0.7"
      />
      {/* ステム */}
      <rect x="74" y="100" width="12" height="70" fill="#2c2c2c" opacity="0.6" rx="6" />
      {/* ベース */}
      <ellipse cx="80" cy="175" rx="40" ry="10" fill="#2c2c2c" opacity="0.4" />
      {/* ハイライト */}
      <path
        d="M50 35 Q48 70 75 85"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export default function ImageUploadPage() {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWineCardImage(reader.result as string);
      setLocation("/name");
    };
    reader.readAsDataURL(file);
  };

  const handleSkip = () => {
    setWineCardImage(null);
    setLocation("/name");
  };

  return (
    <div className="min-h-screen w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]">
      <div
        className="relative w-full h-screen bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto flex flex-col items-center justify-between py-16 px-6"
      >
        {/* WINE テキスト */}
        <h1
          className="text-[40px] tracking-widest text-[#2c2c2c] text-center leading-none"
          style={{ fontFamily: "'Goblin One', 'Playfair Display', serif" }}
        >
          WINE
        </h1>

        {/* ワイングラスイラスト */}
        <div className="flex items-center justify-center flex-1">
          <WineGlassIllustration />
        </div>

        {/* DIARY テキスト */}
        <h2
          className="text-[40px] tracking-widest text-[#2c2c2c] text-center leading-none mb-12"
          style={{ fontFamily: "'Goblin One', 'Playfair Display', serif" }}
        >
          DIARY
        </h2>

        {/* ボタンエリア */}
        <div className="w-full flex flex-col gap-4 items-center">
          {/* ワインの写真を撮るボタン */}
          <label className="w-full cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="ワインの画像を選択"
            />
            <span className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-[64px] bg-[#4b6c3d] text-[#f5f1e8] text-[16px] font-bold hover:opacity-90 transition-opacity">
              <Camera className="w-5 h-5 flex-shrink-0" />
              ワインの写真を撮る
            </span>
          </label>

          {/* 写真はないよリンク */}
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-2 py-3 px-4 text-[14px] font-bold text-[#2c2c2c] hover:opacity-70 transition-opacity"
          >
            写真はないよ
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
