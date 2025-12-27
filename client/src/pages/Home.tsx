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
    },
    mode: "onChange"
  });

  // Watch values for real-time preview
  const watchedValues = form.watch();

  const onSubmit = async (data: InsertWineCard) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/707c110a-8138-4312-88af-89e602fc9763',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Home.tsx:48',message:'onSubmit呼び出し',data:{wineName:data.wineName,themeColor:data.themeColor},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "transparent",
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
        });
        
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `wine-card-${data.wineName || "untitled"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          toast({
            title: "カメラロールに保存しました",
            description: "ワインカードがダウンロードフォルダに保存されました。",
          });
        }, 300);
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
