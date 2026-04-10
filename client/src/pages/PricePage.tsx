import { useState } from "react";
import { useLocation } from "wouter";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { useFlowParams, buildFlowQuery } from "@/hooks/useFlowParams";
import { getWineCardImage } from "@/hooks/useWineCardImage";

const MIN = 500;
const MAX = 15000;
const STEP = 500;
const DEFAULT = 3500;

export default function PricePage() {
  const [, setLocation] = useLocation();
  const { theme, name, variety, origin, location } = useFlowParams();
  const [price, setPrice] = useState(DEFAULT);
  const wineImageSrc = getWineCardImage() ?? "/wine-glass.png";

  const pct = ((price - MIN) / (MAX - MIN)) * 100;

  return (
    <QuestionScreenLayout
      stepIndex={7}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      wineImageSrc={wineImageSrc}
      title="値段は？"
      onNext={() => {
        setLocation(
          `/rating${buildFlowQuery({
            theme,
            name,
            variety,
            origin,
            location,
            price: price.toString(),
          })}`
        );
      }}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* 価格表示 */}
        <div className="flex items-baseline gap-1">
          <span className="text-[40px] font-bold text-[#2c2c2c] leading-none">
            {price.toLocaleString()}
          </span>
          <span className="text-[20px] text-[#5c5246] font-medium">円</span>
        </div>

        {/* スライダー */}
        <div className="w-full px-2">
          <div className="relative w-full h-8 flex items-center">
            {/* トラック背景 */}
            <div className="absolute w-full h-[6px] rounded-full bg-[#e0d8c8]" />
            {/* トラック塗り（選択済み部分） */}
            <div
              className="absolute h-[6px] rounded-full bg-[#4b6c3d]"
              style={{ width: `${pct}%` }}
            />
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="relative w-full appearance-none bg-transparent cursor-pointer"
              style={{
                // サム（つまみ）のスタイル
                ["--thumb-color" as string]: "#4b6c3d",
              }}
            />
          </div>
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: #4b6c3d;
              border: 3px solid #fffbf1;
              box-shadow: 0 2px 8px rgba(75,108,61,0.35);
              cursor: pointer;
            }
            input[type="range"]::-moz-range-thumb {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: #4b6c3d;
              border: 3px solid #fffbf1;
              box-shadow: 0 2px 8px rgba(75,108,61,0.35);
              cursor: pointer;
            }
          `}</style>
        </div>

        {/* 最小・最大ラベル */}
        <div className="w-full flex justify-between text-[12px] text-[#aca3a3] px-2">
          <span>{MIN.toLocaleString()}円</span>
          <span>{MAX.toLocaleString()}円</span>
        </div>
      </div>
    </QuestionScreenLayout>
  );
}
