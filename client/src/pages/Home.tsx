import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wine, 
  MapPin, 
  Utensils, 
  MessageSquare, 
  FileText, 
  Plus, 
  Loader2, 
  Upload,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Download
} from "lucide-react";
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
        "relative px-3 py-2 rounded-full text-sm font-body flex items-center gap-1.5 transition-colors duration-500 border",
        isSelected ? "border-[#722F37] bg-[#722F37]/10 text-[#722F37]" : "border-transparent bg-[#F8F9FA] text-gray-700",
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
                          className="absolute inset-0 whitespace-nowrap flex items-center justify-center"
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const [theme, setTheme] = useState<"red" | "white" | "rose" | "other">("red");
  const [isTransparent, setIsTransparent] = useState(true);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
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
      memo: "",
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

  // 切り抜き設定が変更されたときに画像を切り替え
  useEffect(() => {
    if (!originalImage) return;
    
    if (isTransparent) {
      // 透過がオンの場合、透過済み画像を使用（既にform.wineImageに設定されている）
      // 何もしない（透過済み画像はそのまま）
    } else {
      // 透過がオフの場合、元の画像を使用
      form.setValue("wineImage", originalImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransparent, originalImage]);

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
                  <Label htmlFor="wineImage" className="font-display text-lg">ワインの画像</Label>
                  <div className="space-y-3">
                    <input
                      id="wineImage"
                      type="file"
                      accept="image/*,.heic"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsImageLoading(true);
                          // ファイルサイズチェック（10MB）
                          const maxSize = 10 * 1024 * 1024; // 10MB
                          if (file.size > maxSize) {
                            toast({
                              title: "ファイルサイズが大きすぎます",
                              description: "画像は10MB以下にしてください。",
                              variant: "destructive",
                            });
                            setIsImageLoading(false);
                            return;
                          }
                          
                          // 元の画像を保存（正方形に切り抜く前）
                          const saveOriginalImage = (imageSrc: string) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const ctx = canvas.getContext('2d');
                              if (!ctx) {
                                setIsImageLoading(false);
                                return;
                              }
                              
                              // 正方形に切り抜く（短い辺に合わせる）
                              const size = Math.min(img.width, img.height);
                              const x = (img.width - size) / 2;
                              const y = (img.height - size) / 2;
                              
                              canvas.width = size;
                              canvas.height = size;
                              
                              // 背景を白にして中央部分を切り抜いて描画
                              ctx.fillStyle = '#FFFFFF';
                              ctx.fillRect(0, 0, size, size);
                              ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
                              
                              // 元画像として保存（白背景、正方形に切り抜き済み）
                              const originalBase64 = canvas.toDataURL('image/png');
                              setOriginalImage(originalBase64);
                              
                              // 透過がオフの場合、元画像を使用
                              if (!isTransparent) {
                                form.setValue("wineImage", originalBase64);
                                setIsImageLoading(false);
                              }
                            };
                            img.onerror = () => {
                              console.error('Original image processing failed');
                              setIsImageLoading(false);
                            };
                            img.src = imageSrc;
                          };

                          // 画像を処理する関数（透過用）
                          const processImage = (imageSrc: string, shouldTransparent: boolean) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const ctx = canvas.getContext('2d');
                              if (!ctx) {
                                toast({
                                  title: "画像の処理に失敗しました",
                                  description: "Canvasが使用できません。",
                                  variant: "destructive",
                                });
                                setIsImageLoading(false);
                                return;
                              }
                              
                              // 正方形に切り抜く（短い辺に合わせる）
                              const size = Math.min(img.width, img.height);
                              const x = (img.width - size) / 2;
                              const y = (img.height - size) / 2;
                              
                              canvas.width = size;
                              canvas.height = size;
                              
                              if (shouldTransparent) {
                                // 背景を透明にする
                                ctx.clearRect(0, 0, size, size);
                              } else {
                                // 背景を白にする
                                ctx.fillStyle = '#FFFFFF';
                                ctx.fillRect(0, 0, size, size);
                              }
                              
                              // 中央部分を切り抜いて描画
                              ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
                              
                              // PNG形式で保存（透明度を保持）
                              const croppedBase64 = canvas.toDataURL('image/png');
                              form.setValue("wineImage", croppedBase64);
                              setIsImageLoading(false);
                            };
                            img.onerror = () => {
                              toast({
                                title: "画像の処理に失敗しました",
                                description: "もう一度お試しください。",
                                variant: "destructive",
                              });
                              setIsImageLoading(false);
                            };
                            img.src = imageSrc;
                          };
                          
                          // まず元画像を読み込んで保存
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const originalBase64 = reader.result as string;
                            saveOriginalImage(originalBase64);
                            
                            if (isTransparent) {
                              (async () => {
                                try {
                                  // 背景削除ライブラリを動的にインポート
                                  const { removeBackground } = await import('@imgly/background-removal');
                                  
                                  // ファイルを直接使用して背景を削除
                                  const imageBlob = await removeBackground(file);
                                  // Blobをbase64に変換
                                  const blobReader = new FileReader();
                                  blobReader.onloadend = () => {
                                    const transparentBase64 = blobReader.result as string;
                                    processImage(transparentBase64, true);
                                  };
                                  blobReader.onerror = () => {
                                    toast({
                                      title: "背景削除後の画像の読み込みに失敗しました",
                                      description: "元の画像を使用します。",
                                      variant: "destructive",
                                    });
                                    // 背景削除に失敗した場合は、元の画像を使用
                                    form.setValue("wineImage", originalBase64);
                                    setIsImageLoading(false);
                                  };
                                  blobReader.readAsDataURL(imageBlob);
                                } catch (error) {
                                  console.error('Background removal failed:', error);
                                  // 背景削除に失敗した場合は、元の画像を使用
                                  form.setValue("wineImage", originalBase64);
                                  setIsImageLoading(false);
                                }
                              })();
                            } else {
                              // 透過がオフの場合は、元の画像を使用（既にsaveOriginalImageで設定済み）
                            }
                          };
                          reader.onerror = () => {
                            toast({
                              title: "画像の読み込みに失敗しました",
                              description: "もう一度お試しください。",
                              variant: "destructive",
                            });
                            setIsImageLoading(false);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="wineImage"
                      className={cn(
                        "flex flex-col items-center justify-center w-full rounded-[16px] cursor-pointer transition-colors bg-[#f7f7f7] aspect-[4/3]",
                        watchedValues.wineImage 
                          ? "hover:bg-gray-100" 
                          : "hover:bg-gray-100"
                      )}
                    >
                      {isImageLoading ? (
                        <div className="relative w-full h-full flex items-center justify-center rounded-[16px]">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-2xl text-gray-500 font-body">読み込み中🍷</p>
                          </div>
                        </div>
                      ) : watchedValues.wineImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={watchedValues.wineImage}
                            alt="ワイン画像"
                            className="w-full h-full object-cover rounded-[16px]"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              form.setValue("wineImage", undefined);
                              setOriginalImage(null);
                              setIsImageLoading(false);
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
                          {/* 切り抜きスイッチ（右下） */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg z-10">
                            <Label htmlFor="transparent" className="text-sm font-body cursor-pointer whitespace-nowrap">
                              切り抜き
                            </Label>
                            <Switch
                              id="transparent"
                              checked={isTransparent}
                              onCheckedChange={setIsTransparent}
                              className="scale-75 data-[state=checked]:bg-[#722F37]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Plus className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Wine Type Selector */}
                <div className="space-y-4">
                  <Label className="font-display text-lg">ワインの種類</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "red", label: "赤", color: "#722F37", icon: Wine },
                      { id: "white", label: "白", color: "#F3E5AB", icon: Wine },
                      { id: "rose", label: "ロゼ", color: "#FFC0CB", icon: Wine },
                      { id: "other", label: "他", color: "#E5E7EB", icon: Plus },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setTheme(type.id as any);
                          form.setValue("themeColor", type.id);
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 gap-1",
                          theme === type.id 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-transparent bg-gray-50/50 hover:bg-gray-100"
                        )}
                      >
                        <type.icon 
                          className={cn("w-6 h-6 mb-1")} 
                          style={{ color: theme === type.id ? type.color : "#9CA3AF" }}
                        />
                        <span className={cn(
                          "text-sm font-body",
                          theme === type.id ? "text-primary font-bold" : "text-gray-500"
                        )}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wine Name */}
                <div className="space-y-2">
                  <FloatingInput
                    id="wineName"
                    label="ワイン名"
                    {...form.register("wineName")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        document.getElementById("origin")?.focus();
                      }
                    }}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          document.getElementById("variety")?.focus();
                        }
                      }}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          document.getElementById("location")?.focus();
                        }
                      }}
                    />
                    {form.formState.errors.variety && (
                      <p className="text-sm text-destructive font-body">{form.formState.errors.variety.message}</p>
                    )}
                  </div>
                </div>
                  
                  {/* Location */}
                  <div className="space-y-2">
                  <FloatingInput
                      id="location"
                    label="購入した場所"
                      {...form.register("location")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    />
                    {form.formState.errors.location && (
                      <p className="text-sm text-destructive font-body">{form.formState.errors.location.message}</p>
                    )}
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
                        max={30000}
                        step={500}
                        defaultValue={[watchedValues.price ?? 5000]}
                        onValueCommit={(value) => handlePriceChange(value[0])}
                        className="w-full"
                      />
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
                  <Label className="font-display text-lg">感想</Label>
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
                  <FloatingInput
                    id="freeTextComment"
                    label="メモ"
                    {...form.register("memo")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />
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
                      isTransparent={isTransparent}
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
