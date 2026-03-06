import { useEffect } from "react";

const CSS_VAR = "--browser-bottom-inset";

function updateBottomInset() {
  if (typeof window === "undefined" || !window.visualViewport) return;
  const vv = window.visualViewport;
  const bottomInset = Math.max(
    0,
    window.innerHeight - (vv.offsetTop + vv.height)
  );
  document.documentElement.style.setProperty(CSS_VAR, `${bottomInset}px`);
}

/**
 * Visual Viewport を監視し、ブラウザ下部UI（アドレスバー等）の高さを
 * CSS 変数 --browser-bottom-inset に反映する。
 * つぎへボタンの padding-bottom で利用する。
 */
export function useBottomInset() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    updateBottomInset();
    const vv = window.visualViewport;
    vv.addEventListener("resize", updateBottomInset);
    vv.addEventListener("scroll", updateBottomInset);
    return () => {
      vv.removeEventListener("resize", updateBottomInset);
      vv.removeEventListener("scroll", updateBottomInset);
    };
  }, []);
}
