import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { RatingInput } from "@/components/RatingInput";

function useWineName(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("name") ?? "";
}

export default function RatingPage() {
  const [, setLocation] = useLocation();
  const wineName = useWineName();

  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#f5f1e8]">
      <div className="relative w-full h-[844px] bg-[#f5f1e8] overflow-hidden">
        <div className="relative pt-6 px-6 pb-0 flex items-center justify-center w-full">
          <button
            type="button"
            className="absolute top-[13px] left-0 w-11 h-11 flex items-center justify-center rounded-full text-[#4b6c3d]"
            aria-label="戻る"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                setLocation("/");
              }
            }}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        <div className="pt-8 px-8 flex flex-col gap-8 items-center">
          {wineName && (
            <p className="text-center text-[14px] text-[#5c5246]">
              {wineName}
            </p>
          )}
          <p className="text-center text-[20px] font-bold text-[#2c2c2c]">
            このワインの評価は？
          </p>
          <RatingInput value={rating} onChange={setRating} />
        </div>
      </div>
    </div>
  );
}
