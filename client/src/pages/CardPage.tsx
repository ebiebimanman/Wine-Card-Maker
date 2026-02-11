import { useRef } from "react";
import { useLocation } from "wouter";
import { toPng } from "html-to-image";
import type { InsertWineCard } from "@shared/schema";
import { QuestionScreenLayout } from "@/components/QuestionScreenLayout";
import { WineCardPreview } from "@/components/WineCardPreview";
import { useFlowParams } from "@/hooks/useFlowParams";

const RATING_LABELS: Record<string, string> = {
  "1": "にがて",
  "2": "リピなし",
  "3": "ふつう",
  "4": "また飲みたい",
  "5": "殿堂入り",
};

const THEME_LABELS: Record<string, string> = {
  red: "赤",
  white: "白",
  rose: "ロゼ",
  other: "その他",
};

type ThemeKey = "red" | "white" | "rose" | "other";

function flowParamsToCardData(params: ReturnType<typeof useFlowParams>): {
  cardData: InsertWineCard;
  theme: ThemeKey;
} {
  const ratingNum = params.rating ? parseInt(params.rating, 10) : 0;
  const validRating = Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : 0;
  const priceNum = params.price ? parseInt(params.price, 10) : undefined;
  const validPrice =
    priceNum != null && Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : undefined;
  const theme: ThemeKey =
    params.theme === "red" || params.theme === "white" || params.theme === "rose" || params.theme === "other"
      ? params.theme
      : "other";

  const cardData: InsertWineCard = {
    wineName: params.name?.trim() || "ワイン名未入力",
    myRating: validRating,
    partnerRating: validRating,
    themeColor: theme,
    origin: params.origin?.trim() || undefined,
    variety: params.variety?.trim() || undefined,
    location: params.location?.trim() || undefined,
    price: validPrice,
    pairedFood: [],
    myComment: params.comment?.trim() ? [params.comment.trim()] : [],
    partnerComment: [],
    wineImage: undefined,
  };

  return { cardData, theme };
}

export default function CardPage() {
  const [, setLocation] = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const params = useFlowParams();
  const { cardData, theme } = flowParamsToCardData(params);

  const {
    theme: _theme,
    name,
    variety,
    origin,
    location: locationValue,
    price,
    rating,
    comment,
  } = params;

  const items: { label: string; value: string }[] = [];
  if (_theme) items.push({ label: "テーマ", value: THEME_LABELS[_theme] ?? _theme });
  if (name) items.push({ label: "名前", value: name });
  if (variety) items.push({ label: "品種", value: variety });
  if (origin) items.push({ label: "産地", value: origin });
  if (locationValue) items.push({ label: "場所", value: locationValue });
  if (price) {
    const n = Number(price);
    items.push({
      label: "値段",
      value: Number.isFinite(n) ? `${n.toLocaleString()}円` : price,
    });
  }
  if (rating) items.push({ label: "評価", value: RATING_LABELS[rating] ?? rating });
  if (comment) items.push({ label: "コメント", value: comment });

  const handleSaveImage = async () => {
    const node = cardRef.current;
    if (!node) {
      alert("保存に失敗しました。");
      return;
    }
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "wine-card.png";
      a.click();
    } catch {
      alert("保存に失敗しました。");
    }
  };

  return (
    <QuestionScreenLayout
      stepIndex={9}
      onBack={() => {
        if (window.history.length > 1) window.history.back();
        else setLocation("/");
      }}
      title="入力内容の確認"
      onNext={() => setLocation("/")}
    >
      <div ref={cardRef} className="w-full flex justify-center bg-white rounded-[16px] p-4">
        <WineCardPreview data={cardData} theme={theme} isTransparent={false} />
      </div>
      <button
        type="button"
        onClick={handleSaveImage}
        className="w-full py-3 px-4 rounded-[16px] border-2 border-[#4b6c3d] text-[#4b6c3d] font-bold text-[14px] hover:bg-[#4b6c3d]/10 transition-colors"
      >
        画像を保存
      </button>
      <div className="w-full space-y-3 text-[14px] text-[#2c2c2c]">
        {items.map(({ label, value }) => (
          <p key={label} className="flex justify-between gap-4">
            <span className="text-[#5c5246]">{label}</span>
            <span className="font-medium text-right break-words max-w-[60%]">
              {value}
            </span>
          </p>
        ))}
      </div>
      <p className="text-center text-[12px] text-[#5c5246]">
        つぎへでトップに戻ります
      </p>
    </QuestionScreenLayout>
  );
}
