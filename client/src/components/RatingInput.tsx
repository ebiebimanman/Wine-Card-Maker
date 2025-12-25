import { motion } from "framer-motion";
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
        <motion.button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange(star)}
          whileHover={!readOnly ? { scale: 1.1 } : {}}
          whileTap={!readOnly ? { scale: 0.95 } : {}}
          className={cn(
            "relative p-1 focus:outline-none",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
        >
          {star <= value ? (
            <motion.div
              key={`filled-${star}-${value}`}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.1,
                delay: (star - 1) * 0.1
              }}
            >
              <Star className="w-6 h-6 fill-accent text-accent transition-colors duration-200" />
            </motion.div>
          ) : (
            <Star className="w-6 h-6 fill-transparent text-muted-foreground/30 hover:text-accent/50 transition-colors duration-200" />
          )}
        </motion.button>
      ))}
    </div>
  );
}
