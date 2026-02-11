/**
 * ワインカード作成フローのクエリパラメータを読み書きするヘルパー
 */
export interface FlowParams {
  theme: string;
  name: string;
  variety: string;
  origin: string;
  location: string;
  price: string;
  rating: string;
  comment: string;
}

function getSearch(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function useFlowParams(): FlowParams {
  const p = getSearch();
  return {
    theme: p.get("theme") ?? "",
    name: p.get("name") ?? "",
    variety: p.get("variety") ?? "",
    origin: p.get("origin") ?? "",
    location: p.get("location") ?? "",
    price: p.get("price") ?? "",
    rating: p.get("rating") ?? "",
    comment: p.get("comment") ?? "",
  };
}

function setIfPresent(q: URLSearchParams, key: string, value: string | undefined): void {
  if (value != null && value !== "") q.set(key, value);
}

export function buildFlowQuery(params: Partial<FlowParams>): string {
  const q = new URLSearchParams();
  setIfPresent(q, "theme", params.theme);
  setIfPresent(q, "name", params.name);
  setIfPresent(q, "variety", params.variety);
  setIfPresent(q, "origin", params.origin);
  setIfPresent(q, "location", params.location);
  setIfPresent(q, "price", params.price);
  setIfPresent(q, "rating", params.rating);
  setIfPresent(q, "comment", params.comment);
  const s = q.toString();
  return s ? `?${s}` : "";
}
