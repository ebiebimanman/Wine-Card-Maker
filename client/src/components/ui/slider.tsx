import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [isActive, setIsActive] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<number[]>(props.value ?? props.defaultValue ?? [0])
  const displayValue = internalValue[0]

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-4",
        className
      )}
      onPointerDown={() => setIsActive(true)}
      onPointerUp={() => setIsActive(false)}
      onPointerLeave={() => setIsActive(false)}
      {...props}
      onValueChange={(val) => {
        setInternalValue(val)
        props.onValueChange?.(val)
      }}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 shadow-md relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {(isActive || isHovered) && (
            <motion.div
              initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.8 }}
              animate={{ opacity: 1, y: -43, x: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: 0, x: "-50%", scale: 0.8 }}
              className="absolute left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-[14px] font-bold rounded shadow-lg pointer-events-none whitespace-nowrap z-50"
            >
              {displayValue.toLocaleString()}円
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-[4px] border-x-transparent border-t-[4px] border-t-primary" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="w-full h-full rounded-full"
          animate={{
            scale: isActive ? 1.25 : isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
