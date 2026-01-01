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
      "relative flex w-full touch-none select-none items-center py-4",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-8 w-full grow overflow-hidden rounded-full bg-gray-100 border border-gray-200">
      {/* Ruler-like tick marks */}
      <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none opacity-40">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-[2px] h-4 bg-gray-400" />
        ))}
      </div>
      <SliderPrimitive.Range className="absolute h-full bg-black/80 rounded-l-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-8 w-8 rounded-full bg-black shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-white" />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
