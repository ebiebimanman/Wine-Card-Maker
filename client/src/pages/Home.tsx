import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wine, 
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
import { RatingInput } from "@/components/RatingInput";
import { WineCardPreview } from "@/components/WineCardPreview";
import { popularWines } from "@/data/popularWines";
import { wineOrigins } from "@/data/wineOrigins";
import { wineVarieties } from "@/data/wineVarieties";

type FoodOption = typeof PAIRED_FOOD_OPTIONS[number];
type CommentOption = typeof COMMENT_OPTIONS[number];

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

const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60);
  });
};

const matchesWineName = (wine: string, query: string): boolean => {
  const normalizedWine = wine.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const katakanaQuery = hiraganaToKatakana(query);
  
  return normalizedWine.includes(normalizedQuery) || 
         wine.includes(katakanaQuery);
};

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
        <span className="invisible pointer-events-none select-none">
          {option}
        </span>
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
                duration: 0.27,
                delay: index * 0.067,
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
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const cancelBackgroundRemovalRef = useRef(false);
  const pendingOriginalImageRef = useRef<string | null>(null);
  const createMutation = useCreateWineCard();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [wineSuggestions, setWineSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [selectedOriginIndex, setSelectedOriginIndex] = useState(-1);
  const originSuggestionsRef = useRef<HTMLDivElement>(null);
  
  const [varietySuggestions, setVarietySuggestions] = useState<string[]>([]);
  const [showVarietySuggestions, setShowVarietySuggestions] = useState(false);
  const [selectedVarietyIndex, setSelectedVarietyIndex] = useState(-1);
  const varietySuggestionsRef = useRef<HTMLDivElement>(null);
  
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
  const locationSuggestionsRef = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const STEP_TITLES = [
    "ワインの画像",
    "ワイン名",
    "ワインの種類",
    "品種",
    "産地",
    "購入した場所",
    "価格",
    "評価",
    "ペアリング",
    "感想",
    "プレビュー"
  ];
  const TOTAL_STEPS = STEP_TITLES.length;
  
  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const canProceed = () => {
    if (currentStep === 1) {
      return (form.getValues("wineName") || "").trim().length > 0;
    }
    if (currentStep === 7) {
      return (form.getValues("myRating") ?? 0) > 0;
    }
    return true;
  };

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

  const watchedValues = form.watch();

  const handlePriceChange = (value: number) => {
    form.setValue("price", value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  useEffect(() => {
    if (!originalImage) return;
    
    if (isTransparent) {
      if (transparentImage) {
        form.setValue("wineImage", transparentImage);
      }
    } else {
      form.setValue("wineImage", originalImage);
    }
  }, [isTransparent, originalImage, transparentImage, form]);

  useEffect(() => {
    const preloadModel = async () => {
      try {
        const { preload } = await import('@imgly/background-removal');
        await preload();
        console.log('Background removal model preloaded');
      } catch (error) {
        console.log('Model preload skipped:', error);
      }
    };
    preloadModel();
  }, []);
  
  useEffect(() => {
    const stored = localStorage.getItem('wineCardLocations');
    if (stored) {
      try {
        const locations = JSON.parse(stored);
        if (Array.isArray(locations)) {
          setSavedLocations(locations);
        }
      } catch (e) {
        console.log('Failed to parse saved locations');
      }
    }
  }, []);
  
  const saveLocation = (location: string) => {
    if (!location.trim()) return;
    const trimmed = location.trim();
    const updated = [trimmed, ...savedLocations.filter(l => l !== trimmed)].slice(0, 50);
    setSavedLocations(updated);
    localStorage.setItem('wineCardLocations', JSON.stringify(updated));
  };

  const onSubmit = async (data: InsertWineCard) => {
    try {
      if (cardRef.current) {
        const images = cardRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              setTimeout(() => resolve(), 5000);
            });
          })
        );

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        const dataUrl = await toPng(cardRef.current, {
          backgroundColor: "#F5F5F0",
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
          filter: (node) => {
            return !(node as HTMLElement).classList?.contains('hidden');
          },
        });
        
        if (isTouchDevice) {
          setSavedImageUrl(dataUrl);
          setIsImageModalOpen(true);
          
          toast({
            title: "画像を生成しました",
            description: "画像を長押しして「写真に保存」を選択してください。",
          });
        } else {
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
    
    if (data.location) {
      saveLocation(data.location);
    }
    
    createMutation.mutate({ ...data, themeColor: theme });
  };

  const renderImageUpload = () => {
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsImageLoading(true);
        cancelBackgroundRemovalRef.current = false;
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: "ファイルサイズが大きすぎます",
            description: "画像は10MB以下にしてください。",
            variant: "destructive",
          });
          setIsImageLoading(false);
          return;
        }
        
        const saveOriginalImage = (imageSrc: string) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              setIsImageLoading(false);
              return;
            }
            
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
            
            canvas.width = size;
            canvas.height = size;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
            
            const originalBase64 = canvas.toDataURL('image/png');
            setOriginalImage(originalBase64);
            
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

        const processImage = (imageSrc: string) => {
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
            
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
            
            canvas.width = size;
            canvas.height = size;
            
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
            
            const croppedBase64 = canvas.toDataURL('image/png');
            
            setTransparentImage(croppedBase64);
            
            if (isTransparent) {
              form.setValue("wineImage", croppedBase64);
            }
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
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const originalBase64 = reader.result as string;
          pendingOriginalImageRef.current = originalBase64;
          saveOriginalImage(originalBase64);
          
          (async () => {
            try {
              const resizeImage = (file: File, maxSize: number = 1200): Promise<Blob> => {
                return new Promise((resolve, reject) => {
                  const img = new Image();
                  const objectUrl = URL.createObjectURL(file);
                  
                  const cleanup = () => URL.revokeObjectURL(objectUrl);
                  
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxSize || height > maxSize) {
                      if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                      } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                      }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                      cleanup();
                      reject(new Error('Canvas context not available'));
                      return;
                    }
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                      cleanup();
                      if (blob) {
                        resolve(blob);
                      } else {
                        reject(new Error('Failed to create blob'));
                      }
                    }, 'image/png');
                  };
                  img.onerror = () => {
                    cleanup();
                    reject(new Error('Failed to load image'));
                  };
                  img.src = objectUrl;
                });
              };
              
              const resizedBlob = await resizeImage(file, 800);
              
              const { removeBackground } = await import('@imgly/background-removal');
              
              const imageBlob = await removeBackground(resizedBlob);
              
              if (cancelBackgroundRemovalRef.current) {
                setIsImageLoading(false);
                return;
              }
              
              const blobReader = new FileReader();
              blobReader.onloadend = () => {
                if (cancelBackgroundRemovalRef.current) {
                  setIsImageLoading(false);
                  return;
                }
                const transparentBase64 = blobReader.result as string;
                processImage(transparentBase64);
              };
              blobReader.onerror = () => {
                toast({
                  title: "背景削除後の画像の読み込みに失敗しました",
                  description: "元の画像を使用します。",
                  variant: "destructive",
                });
                setIsImageLoading(false);
              };
              blobReader.readAsDataURL(imageBlob);
            } catch (error) {
              console.error('Background removal failed:', error);
              setIsImageLoading(false);
            }
          })();
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
    };

    return (
      <div className="space-y-4">
        <input
          id="wineImage"
          type="file"
          accept="image/*,.heic"
          className="hidden"
          onChange={handleImageChange}
          data-testid="input-wine-image"
        />
        {isImageLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#722F37]" />
              <span className="text-sm text-gray-500">背景を削除中...</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  cancelBackgroundRemovalRef.current = true;
                  const imageToUse = originalImage || pendingOriginalImageRef.current;
                  if (imageToUse) {
                    form.setValue("wineImage", imageToUse);
                    setOriginalImage(imageToUse);
                  }
                  setIsImageLoading(false);
                  toast({
                    title: "キャンセルしました",
                    description: "元の画像を使用します。",
                  });
                }}
                data-testid="button-cancel-background-removal"
              >
                キャンセル
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="wineImage"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#722F37] transition-colors bg-gray-50"
          >
            {watchedValues.wineImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={watchedValues.wineImage}
                alt="Wine preview"
                className="max-h-40 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.setValue("wineImage", undefined);
                  setOriginalImage(null);
                  setTransparentImage(null);
                }}
                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white"
                data-testid="button-remove-image"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Upload className="w-10 h-10" />
              <span className="text-sm">タップして画像を選択</span>
            </div>
          )}
          </label>
        )}
        
        {(originalImage || transparentImage) && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <Label htmlFor="transparent-toggle" className="text-sm text-gray-700">
              背景を透過する
            </Label>
            <Switch
              id="transparent-toggle"
              checked={isTransparent}
              onCheckedChange={setIsTransparent}
              data-testid="switch-transparent"
            />
          </div>
        )}
      </div>
    );
  };

  const renderWineNameInput = () => (
    <div className="space-y-2 relative">
      <FloatingInput
        id="wineName"
        label="ワイン名"
        {...form.register("wineName")}
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (value.length > 0) {
            const filtered = popularWines.filter(wine => 
              matchesWineName(wine, value)
            ).slice(0, 8);
            setWineSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setSelectedSuggestionIndex(-1);
          } else {
            setWineSuggestions([]);
            setShowSuggestions(false);
          }
        }}
        onFocus={() => {
          const value = form.getValues("wineName");
          if (value && value.length > 0) {
            const filtered = popularWines.filter(wine => 
              matchesWineName(wine, value)
            ).slice(0, 8);
            setWineSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
        }}
        onKeyDown={(e) => {
          if (showSuggestions && wineSuggestions.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedSuggestionIndex(prev => 
                prev < wineSuggestions.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
              e.preventDefault();
              form.setValue("wineName", wineSuggestions[selectedSuggestionIndex]);
              setShowSuggestions(false);
              setSelectedSuggestionIndex(-1);
            } else if (e.key === "Escape") {
              setShowSuggestions(false);
              setSelectedSuggestionIndex(-1);
            }
          }
        }}
        autoComplete="off"
        data-testid="input-wine-name"
      />
      <AnimatePresence>
        {showSuggestions && wineSuggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {wineSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm font-body text-popover-foreground hover:bg-muted",
                  index === selectedSuggestionIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  form.setValue("wineName", suggestion);
                  setShowSuggestions(false);
                  setSelectedSuggestionIndex(-1);
                }}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                data-testid={`suggestion-wine-${index}`}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {form.formState.errors.wineName && (
        <p className="text-sm text-destructive font-body">{form.formState.errors.wineName.message}</p>
      )}
    </div>
  );

  const renderWineType = () => {
    const wineTypes: Array<{ value: "red" | "white" | "rose" | "other"; label: string; color: string }> = [
      { value: "red", label: "赤", color: "bg-red-600" },
      { value: "white", label: "白", color: "bg-amber-200" },
      { value: "rose", label: "ロゼ", color: "bg-pink-300" },
      { value: "other", label: "その他", color: "bg-indigo-400" },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {wineTypes.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                theme === value 
                  ? "border-[#722F37] bg-[#722F37]/5" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              data-testid={`button-wine-type-${value}`}
            >
              <div className={cn("w-8 h-8 rounded-full", color)} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderVarietyInput = () => (
    <div className="space-y-2 relative">
      <FloatingInput
        id="variety"
        label="品種"
        {...form.register("variety")}
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (value.length > 0) {
            const filtered = wineVarieties.filter(variety => 
              matchesWineName(variety, value)
            ).slice(0, 8);
            setVarietySuggestions(filtered);
            setShowVarietySuggestions(filtered.length > 0);
            setSelectedVarietyIndex(-1);
          } else {
            setVarietySuggestions([]);
            setShowVarietySuggestions(false);
          }
        }}
        onFocus={() => {
          const value = form.getValues("variety");
          if (value && value.length > 0) {
            const filtered = wineVarieties.filter(variety => 
              matchesWineName(variety, value)
            ).slice(0, 8);
            setVarietySuggestions(filtered);
            setShowVarietySuggestions(filtered.length > 0);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowVarietySuggestions(false), 150);
        }}
        onKeyDown={(e) => {
          if (showVarietySuggestions && varietySuggestions.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedVarietyIndex(prev => 
                prev < varietySuggestions.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedVarietyIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === "Enter" && selectedVarietyIndex >= 0) {
              e.preventDefault();
              form.setValue("variety", varietySuggestions[selectedVarietyIndex]);
              setShowVarietySuggestions(false);
            } else if (e.key === "Escape") {
              setShowVarietySuggestions(false);
            }
          }
        }}
        data-testid="input-variety"
      />
      <AnimatePresence>
        {showVarietySuggestions && varietySuggestions.length > 0 && (
          <motion.div
            ref={varietySuggestionsRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {varietySuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm font-body text-popover-foreground hover:bg-muted",
                  index === selectedVarietyIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  form.setValue("variety", suggestion);
                  setShowVarietySuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {form.formState.errors.variety && (
        <p className="text-sm text-destructive font-body">{form.formState.errors.variety.message}</p>
      )}
    </div>
  );

  const renderOriginInput = () => (
    <div className="space-y-2 relative">
      <FloatingInput
        id="origin"
        label="産地"
        {...form.register("origin")}
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (value.length > 0) {
            const filtered = wineOrigins.filter(origin => 
              matchesWineName(origin, value)
            ).slice(0, 8);
            setOriginSuggestions(filtered);
            setShowOriginSuggestions(filtered.length > 0);
            setSelectedOriginIndex(-1);
          } else {
            setOriginSuggestions([]);
            setShowOriginSuggestions(false);
          }
        }}
        onFocus={() => {
          const value = form.getValues("origin");
          if (value && value.length > 0) {
            const filtered = wineOrigins.filter(origin => 
              matchesWineName(origin, value)
            ).slice(0, 8);
            setOriginSuggestions(filtered);
            setShowOriginSuggestions(filtered.length > 0);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowOriginSuggestions(false), 150);
        }}
        onKeyDown={(e) => {
          if (showOriginSuggestions && originSuggestions.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedOriginIndex(prev => 
                prev < originSuggestions.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedOriginIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === "Enter" && selectedOriginIndex >= 0) {
              e.preventDefault();
              form.setValue("origin", originSuggestions[selectedOriginIndex]);
              setShowOriginSuggestions(false);
            } else if (e.key === "Escape") {
              setShowOriginSuggestions(false);
            }
          }
        }}
        data-testid="input-origin"
      />
      <AnimatePresence>
        {showOriginSuggestions && originSuggestions.length > 0 && (
          <motion.div
            ref={originSuggestionsRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {originSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm font-body text-popover-foreground hover:bg-muted",
                  index === selectedOriginIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  form.setValue("origin", suggestion);
                  setShowOriginSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {form.formState.errors.origin && (
        <p className="text-sm text-destructive font-body">{form.formState.errors.origin.message}</p>
      )}
    </div>
  );

  const renderLocationInput = () => (
    <div className="space-y-2 relative">
      <FloatingInput
        id="location"
        label="購入した場所"
        {...form.register("location")}
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (value.length > 0 && savedLocations.length > 0) {
            const filtered = savedLocations.filter(loc => 
              matchesWineName(loc, value)
            ).slice(0, 8);
            setLocationSuggestions(filtered);
            setShowLocationSuggestions(filtered.length > 0);
            setSelectedLocationIndex(-1);
          } else if (value.length === 0 && savedLocations.length > 0) {
            setLocationSuggestions(savedLocations.slice(0, 8));
            setShowLocationSuggestions(true);
            setSelectedLocationIndex(-1);
          } else {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
          }
        }}
        onFocus={() => {
          const value = form.getValues("location");
          if (savedLocations.length > 0) {
            if (value && value.length > 0) {
              const filtered = savedLocations.filter(loc => 
                matchesWineName(loc, value)
              ).slice(0, 8);
              setLocationSuggestions(filtered);
              setShowLocationSuggestions(filtered.length > 0);
            } else {
              setLocationSuggestions(savedLocations.slice(0, 8));
              setShowLocationSuggestions(true);
            }
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowLocationSuggestions(false), 150);
        }}
        onKeyDown={(e) => {
          if (showLocationSuggestions && locationSuggestions.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedLocationIndex(prev => 
                prev < locationSuggestions.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedLocationIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === "Enter" && selectedLocationIndex >= 0) {
              e.preventDefault();
              form.setValue("location", locationSuggestions[selectedLocationIndex]);
              setShowLocationSuggestions(false);
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "Escape") {
              setShowLocationSuggestions(false);
            }
          }
        }}
        data-testid="input-location"
      />
      <AnimatePresence>
        {showLocationSuggestions && locationSuggestions.length > 0 && (
          <motion.div
            ref={locationSuggestionsRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {locationSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm font-body text-popover-foreground hover:bg-muted",
                  index === selectedLocationIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  form.setValue("location", suggestion);
                  setShowLocationSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {form.formState.errors.location && (
        <p className="text-sm text-destructive font-body">{form.formState.errors.location.message}</p>
      )}
    </div>
  );

  const renderPriceInput = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-[#722F37]">
          {(watchedValues.price ?? 5000).toLocaleString()}
          <span className="text-lg ml-1">円</span>
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
        data-testid="slider-price"
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>500円</span>
        <span>30,000円</span>
      </div>
    </div>
  );

  const renderRatingInput = () => (
    <div className="flex justify-center py-4">
      <RatingInput
        value={watchedValues.myRating ?? 3}
        onChange={(value) => form.setValue("myRating", value)}
      />
    </div>
  );

  const renderPairingInput = () => (
    <div className="flex flex-wrap gap-2 justify-center">
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
  );

  const renderCommentsInput = () => (
    <div className="flex flex-wrap gap-2 justify-center">
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
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ワインの画像</h2>
              <p className="text-gray-500 text-sm">ワインのボトルを撮影してください（任意）</p>
            </div>
            {renderImageUpload()}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ワイン名</h2>
              <p className="text-gray-500 text-sm">ワインの名前を入力してください（必須）</p>
            </div>
            {renderWineNameInput()}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ワインの種類</h2>
              <p className="text-gray-500 text-sm">赤、白、ロゼ、その他から選択</p>
            </div>
            {renderWineType()}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">品種</h2>
              <p className="text-gray-500 text-sm">ブドウの品種を入力（任意）</p>
            </div>
            {renderVarietyInput()}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">産地</h2>
              <p className="text-gray-500 text-sm">ワインの産地を入力（任意）</p>
            </div>
            {renderOriginInput()}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">購入した場所</h2>
              <p className="text-gray-500 text-sm">購入店舗やレストラン名（任意）</p>
            </div>
            {renderLocationInput()}
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">価格</h2>
              <p className="text-gray-500 text-sm">ワインの価格（任意）</p>
            </div>
            {renderPriceInput()}
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">評価</h2>
              <p className="text-gray-500 text-sm">このワインの評価（必須）</p>
            </div>
            {renderRatingInput()}
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ペアリング</h2>
              <p className="text-gray-500 text-sm">このワインに合う料理（任意）</p>
            </div>
            {renderPairingInput()}
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">感想</h2>
              <p className="text-gray-500 text-sm">ワインの印象を選択（任意）</p>
            </div>
            {renderCommentsInput()}
          </div>
        );
      case 10:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">プレビュー</h2>
              <p className="text-gray-500 text-sm">カードを確認して保存しましょう</p>
            </div>
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] overflow-x-hidden selection:bg-rose-200 selection:text-rose-900 pb-24">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{STEP_TITLES[currentStep]}</span>
            <span className="text-sm text-gray-400">{currentStep + 1} / {TOTAL_STEPS}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-[#722F37] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 shadow-xl bg-white/90 backdrop-blur-sm border-white/50">
                {renderStepContent()}
              </Card>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-4 z-50">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              className="flex-1 h-12 font-medium"
              data-testid="button-prev-step"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              戻る
            </Button>
          )}
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="flex-1 h-12 font-medium bg-[#722F37] hover:bg-[#5a252c] text-white"
              data-testid="button-next-step"
            >
              次へ
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={createMutation.isPending}
              className="flex-1 h-12 font-medium bg-[#722F37] hover:bg-[#5a252c] text-white"
              data-testid="button-save-card"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  作成中
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  カードを保存
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ワインカード</DialogTitle>
            <DialogDescription>
              画像を長押しして「写真に保存」を選択してください
            </DialogDescription>
          </DialogHeader>
          {savedImageUrl && (
            <div className="flex justify-center p-4">
              <img 
                src={savedImageUrl} 
                alt="Wine Card" 
                className="max-w-full rounded-lg shadow-lg"
              />
            </div>
          )}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImageModalOpen(false)}
              data-testid="button-close-modal"
            >
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
