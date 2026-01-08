import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";

import { insertWineCardSchema, type InsertWineCard, COMMENT_OPTIONS, PAIRED_FOOD_OPTIONS } from "@shared/schema";
import { useCreateWineCard } from "@/hooks/use-wine-cards";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RatingInput } from "@/components/RatingInput";
import { WineCardPreview } from "@/components/WineCardPreview";

// ユニオン型の生成
type FoodOption = typeof PAIRED_FOOD_OPTIONS[number];
type CommentOption = typeof COMMENT_OPTIONS[number];

// アイコンマッピング
const PAIRED_FOOD_ICONS: Record<FoodOption, string> = {
  "チーズ": "🧀",
  "ステーキ": "🥩",
  "魚料理": "🐟",
  "和食": "🍣",
  "パスタ": "🍝",
  "チョコレート": "🍫",
  "デザート": "🍰",
  "海鮮": "🦐",
  "フルーツ": "🍇",
  "前菜": "🥗",
};

const COMMENT_ICONS: Record<CommentOption, string> = {
  "香りが良い": "🌹",
  "飲みやすい": "💧",
  "後味が良い": "✨",
  "深い味わい": "🌙",
  "フルーティー": "🍎",
  "華やか": "🎆",
  "しっかりした味": "💪",
  "爽やか": "🌿",
  "上品": "👑",
  "クリーミー": "☁️",
};

// マルチセレクトボタンコンポーネント
interface MultiSelectButtonProps {
  option: FoodOption | CommentOption;
  isSelected: boolean;
  icon: string;
  onClick: () => void;
  className?: string;
}

function MultiSelectButton({ option, isSelected, icon, onClick, className }: MultiSelectButtonProps) {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleButtonClick = () => {
    if (!isSelected) {
      setIsBouncing(true);
      // アニメーションが1周したらリセット（待機時間含まず）
      setTimeout(() => setIsBouncing(false), (option.length * 0.1) * 1000 + 400);
    }
    onClick();
  };

  return (
    <motion.button
      type="button"
      layout
      onClick={handleButtonClick}
      whileTap={{ scale: 0.8 }}
      className={cn(
        "relative px-3 py-1.5 rounded-full text-sm font-body flex items-center gap-1.5 transition-colors duration-500",
        isSelected ? "bg-[#722F37] text-white" : "bg-[#F8F9FA] text-gray-700",
        className
      )}
      transition={{
        layout: { duration: 0.3, ease: "easeOut" },
        scale: { duration: 0.2, ease: "easeInOut" },
      }}
    >
      <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          {isSelected && (
            <motion.span
              key="check"
              className="inline-flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Check className="w-3.5 h-3.5" />
            </motion.span>
          )}
          {!isSelected && (
            <span key="icon" className="inline-flex items-center justify-center text-lg leading-none">
              {icon}
            </span>
          )}
        </AnimatePresence>
      </span>
      <div className="relative z-10 flex">
        {/* レアウトシフトを防ぐための見えない土台 */}
        <span className="invisible pointer-events-none select-none">
          {option}
        </span>
        {/* 実際に表示される跳ねるテキスト */}
        <span
          className="absolute inset-0 whitespace-nowrap flex"
          aria-label={option}
        >
          {option.split("").map((char, index) => (
            <motion.span
              key={`${option}-${index}`}
              aria-hidden="true"
              initial={{ y: 0 }}
              animate={isBouncing ? {
                y: [0, -4, 0],
              } : { y: 0 }}
              transition={{
                duration: 0.27, // 0.4 / 1.5 = ~0.27
                delay: index * 0.067, // 0.1 / 1.5 = ~0.067
                ease: "easeInOut"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      </div>
    </motion.button>
  );
}

// UI Components
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const [theme, setTheme] = useState<"red" | "white">("red");
  const createMutation = useCreateWineCard();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const form = useForm<InsertWineCard>({
    resolver: zodResolver(insertWineCardSchema),
    defaultValues: {
      wineName: "",
      origin: "",
      variety: "",
      location: "",
      price: 5000,
      pairedFood: [],
      myComment: [],
      partnerComment: [],
      myRating: 3,
      partnerRating: 3,
      themeColor: "red",
      wineImage: undefined,
    },
    mode: "onChange"
  });

  // Watch values for real-time preview
  const watchedValues = form.watch();

  const handlePriceChange = (value: number) => {
    form.setValue("price", value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const onSubmit = async (data: InsertWineCard) => {
    try {
      if (cardRef.current) {
        // 画像の読み込みを待つ
        const images = cardRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // エラーでも続行
              // タイムアウト設定（5秒）
              setTimeout(() => resolve(), 5000);
            });
          })
        );

        // タッチデバイスかどうかを判定
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // html-to-imageで画像を生成
        const dataUrl = await toPng(cardRef.current, {
          backgroundColor: "#F5F5F0",
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true, // CORS問題を回避
          filter: (node) => {
            // 不要な要素を除外
            return !(node as HTMLElement).classList?.contains('hidden');
          },
        });
        
        if (isTouchDevice) {
          // スマホ（タッチデバイス）の場合はモーダルで表示
          setSavedImageUrl(dataUrl);
          setIsImageModalOpen(true);
          
          toast({
            title: "画像を生成しました",
            description: "画像を長押しして「写真に保存」を選択してください。",
          });
        } else {
          // PCの場合はダウンロード
        const link = document.createElement("a");
          link.href = dataUrl;
        link.download = `wine-card-${data.wineName || "untitled"}.png`;
          link.style.display = "none";
        document.body.appendChild(link);
          
          requestAnimationFrame(() => {
        link.click();
            setTimeout(() => {
        document.body.removeChild(link);
          toast({
            title: "カメラロールに保存しました",
            description: "ワインカードがダウンロードフォルダに保存されました。",
          });
            }, 100);
          });
        }
      } else {
        console.error("cardRef.current is null");
        throw new Error("Card element not found");
      }
    } catch (error) {
      console.error("Canvas capture error:", error);
      toast({
        title: "保存に失敗しました",
        description: "カードの保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
    
    createMutation.mutate({ ...data, themeColor: theme });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] overflow-x-hidden selection:bg-rose-200 selection:text-rose-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 lg:px-8">
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8 order-2 lg:order-1"
          >
            <Card className="p-6 md:p-8 shadow-xl bg-white/80 backdrop-blur-sm border-white/50">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Wine Image Upload */}
                <div className="space-y-2">
                  <div className="space-y-3">
                    <input
                      id="wineImage"
                      type="file"
                      accept="image/*,.heic"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // ファイルサイズチェック（10MB）
                          const maxSize = 10 * 1024 * 1024; // 10MB
                          if (file.size > maxSize) {
                            toast({
                              title: "ファイルサイズが大きすぎます",
                              description: "画像は10MB以下にしてください。",
                              variant: "destructive",
                            });
                            return;
                          }
                          
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64String = reader.result as string;
                            form.setValue("wineImage", base64String);
                          };
                          reader.onerror = () => {
                            toast({
                              title: "画像の読み込みに失敗しました",
                              description: "もう一度お試しください。",
                              variant: "destructive",
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="wineImage"
                      className={cn(
                        "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                        watchedValues.wineImage 
                          ? "border-gray-300 hover:border-gray-400" 
                          : "border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {watchedValues.wineImage ? (
                        <div className="relative w-full">
                          <img
                            src={watchedValues.wineImage}
                            alt="ワイン画像"
                            className="w-full h-48 object-cover rounded-[16px]"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              form.setValue("wineImage", undefined);
                              const input = document.getElementById("wineImage") as HTMLInputElement;
                              if (input) input.value = "";
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            aria-label="画像を削除"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-2 left-2 right-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                document.getElementById("wineImage")?.click();
                              }}
                              className="bg-white/90 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white transition-colors shadow-sm"
                            >
                              画像を変更
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <svg
                            className="w-12 h-12 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="mb-1 text-sm text-gray-600">
                            <span className="font-semibold">クリックして画像を選択</span>
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, HEIC (最大10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Theme Selection */}
                <div className="space-y-3">
                  <ThemeToggle theme={theme} onThemeChange={(t) => {
                    setTheme(t);
                    form.setValue("themeColor", t);
                  }} />
                </div>

                {/* Wine Name */}
                <div className="space-y-2">
                  <FloatingInput
                    id="wineName"
                    label="ワイン名"
                    {...form.register("wineName")}
                  />
                  {form.formState.errors.wineName && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.wineName.message}</p>
                  )}
                </div>

                {/* Origin and Variety */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FloatingInput
                      id="origin"
                      label="産地"
                      {...form.register("origin")}
                    />
                    {form.formState.errors.origin && (
                      <p className="text-sm text-destructive font-body">{form.formState.errors.origin.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <FloatingInput
                      id="variety"
                      label="品種"
                      {...form.register("variety")}
                    />
                    {form.formState.errors.variety && (
                      <p className="text-sm text-destructive font-body">{form.formState.errors.variety.message}</p>
                    )}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="price" className="font-display text-lg">価格</Label>
                    <div className="font-body text-lg font-bold flex items-baseline gap-1">
                      <span>{(watchedValues.price ?? 5000).toLocaleString()}</span>
                      <span className="text-sm">円</span>
                    </div>
                  </div>
                  <Slider
                    id="price"
                    min={500}
                    max={10000}
                    step={500}
                    value={[watchedValues.price ?? 5000]}
                    onValueChange={(value) => handlePriceChange(value[0])}
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <FloatingInput
                    id="location"
                    label="購入した場所"
                    {...form.register("location")}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.location.message}</p>
                  )}
                </div>

                {/* Paired Food */}
                <div className="space-y-4">
                  <Label className="font-display text-lg">このワインに合う料理</Label>
                  <div className="flex flex-wrap gap-2">
                    {PAIRED_FOOD_OPTIONS.map((option) => {
                      const isSelected = (watchedValues.pairedFood?.includes(option) ?? false);
                      
                      return (
                        <MultiSelectButton
                          key={option}
                          option={option}
                          isSelected={isSelected}
                          icon={PAIRED_FOOD_ICONS[option] || ""}
                          onClick={() => {
                            const current = watchedValues.pairedFood ?? [];
                            if (current.includes(option)) {
                              form.setValue("pairedFood", current.filter((c) => c !== option));
                            } else {
                              form.setValue("pairedFood", [...current, option]);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-4">
                  <Label className="font-display text-lg">特徴・コメント</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMENT_OPTIONS.map((option) => {
                      const isSelected = (watchedValues.myComment?.includes(option) ?? false);
                      
                      return (
                        <MultiSelectButton
                          key={option}
                          option={option}
                          isSelected={isSelected}
                          icon={COMMENT_ICONS[option] || ""}
                          onClick={() => {
                            const current = watchedValues.myComment ?? [];
                            if (current.includes(option)) {
                              form.setValue("myComment", current.filter((c) => c !== option));
                            } else {
                              form.setValue("myComment", [...current, option]);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label className="font-display text-lg">評価</Label>
                  <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 flex justify-center">
                    <RatingInput
                      value={watchedValues.myRating}
                      onChange={(val) => form.setValue("myRating", val)}
                    />
                  </div>
                  {form.formState.errors.myRating && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.myRating.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      className="w-full h-12 font-display text-lg bg-[#2D2424] hover:bg-[#4A3B3B] text-[#F5F5F0] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>作成中</span>
                        </>
                      ) : (
                        "ワインカードを作成"
                      )}
                    </Button>
                  </motion.div>
                </div>

              </form>
            </Card>
          </motion.div>

          {/* RIGHT COLUMN: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1 lg:order-2 sticky top-8"
          >
            <div className="space-y-4 text-center">
              <div className="perspective-1000" ref={cardRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <WineCardPreview 
                      data={{ ...watchedValues, themeColor: theme }} 
                      theme={theme} 
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 画像保存モーダル（スマホ用） */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-4">
          <DialogHeader>
            <DialogTitle>ワインカード</DialogTitle>
            <DialogDescription>
              画像を長押しして「写真に保存」を選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            {savedImageUrl && (
              <img
                src={savedImageUrl}
                alt="ワインカード"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              />
            )}
            <p className="text-sm text-muted-foreground text-center">
              ※ 画像を長押し（タップしてホールド）して「写真に保存」を選択してください
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
