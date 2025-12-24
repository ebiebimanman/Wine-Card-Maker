import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { insertWineCardSchema, type InsertWineCard } from "@shared/schema";
import { useCreateWineCard } from "@/hooks/use-wine-cards";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RatingInput } from "@/components/RatingInput";
import { WineCardPreview } from "@/components/WineCardPreview";

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [theme, setTheme] = useState<"red" | "white">("red");
  const createMutation = useCreateWineCard();

  const form = useForm<InsertWineCard>({
    resolver: zodResolver(insertWineCardSchema),
    defaultValues: {
      wineName: "",
      myComment: "",
      partnerComment: "",
      rating: 0,
      themeColor: "red",
    },
    mode: "onChange"
  });

  // Watch values for real-time preview
  const watchedValues = form.watch();

  const onSubmit = (data: InsertWineCard) => {
    createMutation.mutate({ ...data, themeColor: theme });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] overflow-x-hidden selection:bg-rose-200 selection:text-rose-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl text-[#2D2424] mb-3"
          >
            Wine Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-[#2D2424]/60 italic"
          >
            Capture the essence of your shared moments
          </motion.p>
        </header>

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
                  <Label className="font-display text-lg">Wine Type</Label>
                  <ThemeToggle theme={theme} onThemeChange={(t) => {
                    setTheme(t);
                    form.setValue("themeColor", t);
                  }} />
                </div>

                {/* Wine Name */}
                <div className="space-y-2">
                  <Label htmlFor="wineName" className="font-display text-lg">Wine Name</Label>
                  <Input
                    id="wineName"
                    placeholder="e.g. Château Margaux 2015"
                    className="h-12 text-lg font-body bg-transparent border-b-2 border-t-0 border-x-0 border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors placeholder:text-gray-300"
                    {...form.register("wineName")}
                  />
                  {form.formState.errors.wineName && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.wineName.message}</p>
                  )}
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label className="font-display text-lg">Rating</Label>
                  <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 flex justify-center">
                    <RatingInput
                      value={watchedValues.rating}
                      onChange={(val) => form.setValue("rating", val)}
                    />
                  </div>
                  {form.formState.errors.rating && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.rating.message}</p>
                  )}
                </div>

                {/* My Comment */}
                <div className="space-y-2">
                  <Label htmlFor="myComment" className="font-display text-lg">My Impressions</Label>
                  <Textarea
                    id="myComment"
                    placeholder="Describe the aroma, taste, and feeling..."
                    className="min-h-[100px] resize-none font-body bg-gray-50/30 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20"
                    {...form.register("myComment")}
                  />
                  {form.formState.errors.myComment && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.myComment.message}</p>
                  )}
                </div>

                {/* Partner Comment */}
                <div className="space-y-2">
                  <Label htmlFor="partnerComment" className="font-display text-lg">Partner's Impressions</Label>
                  <Textarea
                    id="partnerComment"
                    placeholder="What did they say?"
                    className="min-h-[100px] resize-none font-body bg-gray-50/30 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/20"
                    {...form.register("partnerComment")}
                  />
                  {form.formState.errors.partnerComment && (
                    <p className="text-sm text-destructive font-body">{form.formState.errors.partnerComment.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    className="w-full h-12 font-display text-lg bg-[#2D2424] hover:bg-[#4A3B3B] text-[#F5F5F0] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {createMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Saving Memory...
                      </span>
                    ) : (
                      "Save Memory Card"
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
              <h3 className="font-display text-xl text-[#2D2424]/40 uppercase tracking-widest">Live Preview</h3>
              <div className="perspective-1000">
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
                * Design updates automatically as you type
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
