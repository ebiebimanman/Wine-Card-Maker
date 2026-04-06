import { type ElementType } from "react";
import { useLocation } from "wouter";
import { MapPin, Grape, ShoppingCart, JapaneseYen, MessageSquare, Star, Wine } from "lucide-react";
import { useFlowParams } from "@/hooks/useFlowParams";
import { getWineCardImage } from "@/hooks/useWineCardImage";
import { useBottomInset } from "@/hooks/useBottomInset";
import { NextFooterButton } from "@/components/QuestionScreenLayout";

type ThemeKey = "red" | "white" | "rose" | "other";

const THEME_ACCENT: Record<ThemeKey, string> = {
  red: "#ad1e1e",
  white: "#8b7355",
  rose: "#db7093",
  other: "#6b7280",
};

const THEME_BG: Record<ThemeKey, string> = {
  red: "#fdf6f6",
  white: "#fffdf5",
  rose: "#fff5f8",
  other: "#f5f5f5",
};

// Figmaデザインに合わせたステッパー（完了状態）
function CompleteStepper() {
  const totalSteps = 9;
  return (
    <div className="flex items-center justify-center pt-8 pb-1">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index}>
            {index === totalSteps - 1 ? (
              <div className="bg-[#4b6c3d] flex size-8 items-center justify-center rounded-full border-[3px] border-[#f5f1e8] shadow-sm">
                <Wine className="text-[#f5f1e8] size-4" />
              </div>
            ) : (
              <div className="size-2.5 rounded-full bg-[#4b6c3d]/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Figmaデザインに合わせたワインカード表示
function WineInfoCard({
  name,
  rating,
  origin,
  variety,
  location,
  price,
  comment,
  theme,
  imageSrc,
}: {
  name: string;
  rating: number;
  origin?: string;
  variety?: string;
  location?: string;
  price?: string;
  comment?: string;
  theme: ThemeKey;
  imageSrc?: string | null;
}) {
  const accentColor = THEME_ACCENT[theme];
  const bgColor = THEME_BG[theme];

  const infoRows = [
    origin ? { icon: MapPin, text: origin } : null,
    variety ? { icon: Grape, text: variety } : null,
    location ? { icon: ShoppingCart, text: location } : null,
    price
      ? {
          icon: JapaneseYen,
          text: `${Number(price).toLocaleString()}円`,
        }
      : null,
    comment ? { icon: MessageSquare, text: comment } : null,
  ].filter(Boolean) as { icon: ElementType; text: string }[];

  return (
    <div
      className="w-full rounded-[16px] overflow-hidden shadow-[0_8px_24px_rgba(75,108,61,0.15)] flex"
      style={{ backgroundColor: bgColor }}
    >
      {/* 左: ワインボトル画像 */}
      <div
        className="w-[35%] flex-shrink-0 flex items-stretch overflow-hidden rounded-l-[16px]"
        style={{ backgroundColor: "#e8e0d0", minHeight: 240 }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Wine"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <Wine className="w-12 h-12" style={{ color: accentColor }} />
          </div>
        )}
      </div>

      {/* 右: ワイン情報 */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* ワイン名 */}
        <div>
          <p
            className="text-[18px] font-black leading-tight"
            style={{ color: accentColor, fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {name}
          </p>
          {/* 評価スター */}
          {rating > 0 && (
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < rating ? accentColor : "transparent"}
                  stroke={i < rating ? accentColor : "#ddd"}
                />
              ))}
            </div>
          )}
        </div>

        {/* 情報行 */}
        <div className="flex flex-col gap-1.5">
          {infoRows.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <Icon
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: accentColor }}
              />
              <span
                className="text-[12px] leading-snug break-words"
                style={{ color: accentColor, fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CardPage() {
  const [, setLocation] = useLocation();
  const params = useFlowParams();
  const wineImageSrc = getWineCardImage();
  useBottomInset();

  const theme: ThemeKey =
    params.theme === "red" || params.theme === "white" || params.theme === "rose" || params.theme === "other"
      ? params.theme
      : "other";

  const ratingNum = params.rating ? parseInt(params.rating, 10) : 0;
  const validRating = Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : 0;

  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else setLocation("/comment");
  };

  return (
    <div className="min-h-screen w-full flex justify-center sm:py-6 sm:px-4 bg-[#f5f1e8]">
      <div className="relative w-full h-screen bg-[#f5f1e8] overflow-hidden sm:max-w-[480px] sm:mx-auto sm:rounded-[24px] sm:shadow-2xl sm:max-h-[844px] sm:my-auto flex flex-col">
        {/* ステッパー */}
        <CompleteStepper />

        {/* カード表示エリア（スクロール可） */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {/* ワインカード */}
          <div className="w-full">
            <WineInfoCard
              name={params.name || "ワイン名未入力"}
              rating={validRating}
              origin={params.origin}
              variety={params.variety}
              location={params.location}
              price={params.price}
              comment={params.comment}
              theme={theme}
              imageSrc={wineImageSrc}
            />
          </div>

        </div>

        {/* 底部: 最初からボタン */}
        <div className="flex-shrink-0">
          <NextFooterButton
            onNext={handleBack}
            label="修正する"
          />
        </div>
      </div>
    </div>
  );
}
