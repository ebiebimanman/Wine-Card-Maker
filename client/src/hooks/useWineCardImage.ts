/**
 * ワインカード用にアップロードされた画像を sessionStorage で保持するヘルパー
 */
const STORAGE_KEY = "wineCardImage";

export function getWineCardImage(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setWineCardImage(dataUrl: string | null): void {
  if (typeof window === "undefined") return;
  if (dataUrl == null) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, dataUrl);
  }
}
