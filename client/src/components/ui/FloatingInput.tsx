import * as React from "react"
import { cn } from "@/lib/utils"

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          {...props}
          ref={ref}
          className={cn(
            "peer w-full rounded-[100px] border-transparent bg-[#f0f0f0] px-4 pt-5 pb-1 text-lg font-body focus:bg-white focus:outline-none focus:ring-0 transition-all duration-200 placeholder:text-transparent",
            className
          )}
          placeholder={label} // peerハックのために必要だが、CSSで隠す
        />
        <label
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-200 font-body text-gray-500",
            "top-1/2 -translate-y-1/2 text-lg",
            "peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-gray-400",
            "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-400"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
