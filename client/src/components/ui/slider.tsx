import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center h-10", // h-10で高さを出す
      className
    )}
    {...props}
  >
    {/* トラック（背景の黒い棒） */}
    <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-full bg-secondary/20">
      {/* レンジ（黒く塗りつぶされる部分） */}
      <SliderPrimitive.Range className="absolute h-full bg-black" />
    </SliderPrimitive.Track>
    
    {/* つまみ（白丸） */}
    <SliderPrimitive.Thumb 
      className="block h-8 w-8 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md" 
      // ↓ ここがポイント：つまみがトラックの内側に浮いているように見せるスタイル
      style={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
