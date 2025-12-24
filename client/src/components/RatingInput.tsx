import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  readOnly?: boolean;
}

export function RatingInput({ value, onChange, className, readOnly = false }: RatingInputProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange(star)}
          className={cn(
            "relative p-1 transition-all duration-200 hover:scale-110 focus:outline-none",
            readOnly ? "cursor-default hover:scale-100" : "cursor-pointer"
          )}
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors duration-200",
              star <= value
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground/30 hover:text-accent/50"
            )}
          />
        </button>
      ))}
    </div>
  );
}
