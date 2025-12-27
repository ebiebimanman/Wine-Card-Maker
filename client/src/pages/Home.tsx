import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";

import { insertWineCardSchema, type InsertWineCard, COMMENT_OPTIONS, PAIRED_FOOD_OPTIONS } from "@shared/schema";
import { useCreateWineCard } from "@/hooks/use-wine-cards";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RatingInput } from "@/components/RatingInput";
import { WineCardPreview } from "@/components/WineCardPreview";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const [theme, setTheme] = useState<"red" | "white">("red");
  const createMutation = useCreateWineCard();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const form = useForm<InsertWineCard>({
    resolver: zodResolver(insertWineCardSchema),
    defaultValues: {
      wineName: "",
      location: "",
      price: 5000,
      pairedFood: [],
      myComment: [],
      partnerComment: [],
      myRating: 0,
      partnerRating: 0,
      themeColor: "red",
      wineImage: undefined,
    },
    mode: "onChange"
  });

  // Watch values for real-time preview
  const watchedValues = form.watch();

  const onSubmit = async (data: InsertWineCard) => {
    try {
      if (cardRef.current) {
        // 画像の読み込みを待つ
        const images = cardRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // エラーでも続行
              // タイムアウト設定（5秒）
              setTimeout(() => resolve(), 5000);
            });
          })
        );

        // iPhone Safari用の設定調整
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "transparent",
          scale: 2,
          useCORS: !isIOS, // iOSではuseCORSを無効化
          logging: false,
          allowTaint: isIOS, // iOSではallowTaintを有効化
          onclone: (clonedDoc) => {
            // クローンされたドキュメント内の画像要素を修正
            const clonedImages = clonedDoc.querySelectorAll('img');
            clonedImages.forEach((img) => {
              const originalImg = Array.from(images).find(
                (orig) => orig.src === (img as HTMLImageElement).src
              );
              if (originalImg && originalImg.parentElement) {
                // 元の画像の実際のサイズを取得
                const naturalWidth = originalImg.naturalWidth;
                const naturalHeight = originalImg.naturalHeight;
                const maxHeight = 320; // max-h-80
                
                // コンテナの幅を取得（親要素の幅）
                const containerWidth = originalImg.parentElement.clientWidth || cardRef.current?.clientWidth || 400;
                
                // 比率を維持しながら、最大高さを考慮してサイズを計算
                const aspectRatio = naturalWidth / naturalHeight;
                let displayWidth = containerWidth;
                let displayHeight = containerWidth / aspectRatio;
                
                // 最大高さを超える場合は、高さを制限して幅を調整
                if (displayHeight > maxHeight) {
                  displayHeight = maxHeight;
                  displayWidth = maxHeight * aspectRatio;
                }
                
                // 明示的なサイズを設定
                (img as HTMLImageElement).style.width = `${displayWidth}px`;
                (img as HTMLImageElement).style.height = `${displayHeight}px`;
                (img as HTMLImageElement).style.objectFit = 'contain';
                (img as HTMLImageElement).style.maxHeight = `${maxHeight}px`;
              }
            });
          },
        });
        
        // 画像データを取得
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        
        // iPhone Safariの場合は、画像を新しいウィンドウで開いて長押しで保存できるようにする
        if (isIOS) {
          try {
            // まずWeb Share APIを試す
            if (navigator.share) {
              // Base64をBlobに変換
              const response = await fetch(dataUrl);
              const blob = await response.blob();
              const file = new File([blob], `wine-card-${data.wineName || "untitled"}.png`, {
                type: "image/png",
              });
              
              // ファイル共有がサポートされているか確認
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                  files: [file],
                  title: `ワインカード: ${data.wineName || "untitled"}`,
                });
                
                toast({
                  title: "画像を共有しました",
                  description: "「写真に保存」を選択してカメラロールに保存できます。",
                });
                return; // 成功したら終了
              }
            }
            
            // Web Share APIが使えない場合は、画像を新しいウィンドウで開く
            const newWindow = window.open();
            if (newWindow) {
              newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ワインカード</title>
                    <style>
                      body {
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: #f5f5f0;
                      }
                      img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                      }
                      p {
                        margin-top: 20px;
                        color: #666;
                        text-align: center;
                        font-size: 14px;
                      }
                    </style>
                  </head>
                  <body>
                    <img src="${dataUrl}" alt="ワインカード" />
                    <p>画像を長押しして「写真に保存」を選択してください</p>
                  </body>
                </html>
              `);
              newWindow.document.close();
              
              toast({
                title: "画像を表示しました",
                description: "画像を長押しして「写真に保存」を選択してください。",
              });
            } else {
              throw new Error("ポップアップがブロックされました");
            }
          } catch (error) {
            console.error("iOS保存エラー:", error);
            // 最後の手段：画像を直接表示
            const img = document.createElement("img");
            img.src = dataUrl;
            img.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: #000; z-index: 9999;";
            img.onclick = () => document.body.removeChild(img);
            document.body.appendChild(img);
            
            toast({
              title: "画像を表示しました",
              description: "画像を長押しして「写真に保存」を選択してください。",
            });
          }
        } else {
          // 通常のダウンロード方法（PC/Android）
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `wine-card-${data.wineName || "untitled"}.png`;
          link.style.display = "none";
          document.body.appendChild(link);
          
          // ユーザーインタラクションのコンテキスト内で実行
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
                
                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label className="font-display text-lg">ワインの種類</Label>
                  <ThemeToggle theme={theme} onThemeChange={(t) => {
                    setTheme(t);
                    form.setValue("themeColor", t);
                  }} />
                </div>

                {/* Wine Name */}
                <div className="space-y-2">
                  <Label htmlFor="wineName" className="font-display text-lg">ワイン名</Label>
                  <Input
                    id="wineName"
                    placeholder="例）シャトー・マルゴー 2015"
                    className="h-12 text-lg font-body bg-transparent border-b-2 border-t-0 border-x-0 border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors placeholder:text-gray-300"
                    {...form.register("wineName")}
                  />
                  {form.formState.errors.wineName && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.wineName.message}</p>
                  )}
                </div>

                {/* Wine Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="wineImage" className="font-display text-lg">ワインの画像</Label>
                  <div className="space-y-3">
                    <input
                      id="wineImage"
                      type="file"
                      accept="image/*"
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
                            className="w-full h-48 object-cover rounded-lg"
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
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (最大10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Wine Information */}
                <div className="space-y-4">
                  <Label className="font-display text-lg">ワイン情報</Label>
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-body">購入した場所</Label>
                    <Input
                      id="location"
                      placeholder="例）新宿の酒屋、オンラインストア"
                      className="h-10 text-sm font-body bg-gray-50/30 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20"
                      {...form.register("location")}
                    />
                    {form.formState.errors.location && (
                      <p className="text-sm text-destructive font-body">{form.formState.errors.location.message}</p>
                    )}
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label htmlFor="price" className="text-sm font-body">
                        価格: 
                        <motion.span
                          key={watchedValues.price}
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                          className="ml-1 inline-block"
                        >
                          ¥{(watchedValues.price ?? 5000).toLocaleString()}
                        </motion.span>
                      </Label>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Slider
                        id="price"
                        min={500}
                        max={10000}
                        step={500}
                        value={[watchedValues.price ?? 5000]}
                        onValueChange={(value) => form.setValue("price", value[0])}
                        className="w-full"
                      />
                    </motion.div>
                  </div>

                  {/* Paired Food */}
                  <div className="space-y-2">
                    <Label className="text-sm font-body">このワインに合う料理</Label>
                    <div className="flex flex-wrap gap-2">
                      {PAIRED_FOOD_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            const current = watchedValues.pairedFood ?? [];
                            if (current.includes(option)) {
                              form.setValue("pairedFood", current.filter((c) => c !== option));
                            } else {
                              form.setValue("pairedFood", [...current, option]);
                            }
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-body transition-all",
                            (watchedValues.pairedFood?.includes(option) ?? false)
                              ? "bg-[#722F37] text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* My Rating */}
                <div className="space-y-2">
                  <Label className="font-display text-lg">わたしの評価</Label>
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

                {/* My Comment */}
                <div className="space-y-2">
                  <Label className="font-display text-lg">わたしの感想</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMENT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const current = watchedValues.myComment ?? [];
                          if (current.includes(option)) {
                            form.setValue("myComment", current.filter((c) => c !== option));
                          } else {
                            form.setValue("myComment", [...current, option]);
                          }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-body transition-all",
                          (watchedValues.myComment?.includes(option) ?? false)
                            ? "bg-[#722F37] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Partner Rating */}
                <div className="space-y-2">
                  <Label className="font-display text-lg">あなたの評価</Label>
                  <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 flex justify-center">
                    <RatingInput
                      value={watchedValues.partnerRating}
                      onChange={(val) => form.setValue("partnerRating", val)}
                    />
                  </div>
                  {form.formState.errors.partnerRating && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.partnerRating.message}</p>
                  )}
                </div>

                {/* Partner Comment */}
                <div className="space-y-2">
                  <Label className="font-display text-lg">あなたの感想</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMENT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const current = watchedValues.partnerComment ?? [];
                          if (current.includes(option)) {
                            form.setValue("partnerComment", current.filter((c) => c !== option));
                          } else {
                            form.setValue("partnerComment", [...current, option]);
                          }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-body transition-all",
                          (watchedValues.partnerComment?.includes(option) ?? false)
                            ? "bg-[#722F37] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    className="w-full h-12 font-display text-lg bg-[#2D2424] hover:bg-[#4A3B3B] text-[#F5F5F0] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {createMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> 保存中...
                      </span>
                    ) : (
                      "カードを保存"
                    )}
                  </Button>
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
              <p className="text-xs text-[#2D2424]/30 font-sans mt-4">
                * 入力と同時にプレビューが更新されます
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
