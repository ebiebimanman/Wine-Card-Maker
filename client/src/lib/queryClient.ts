import { QueryClient, QueryFunction } from "@tanstack/react-query";

// APIのベースURLを取得（環境変数があればそれを使う、なければ相対パス）
function getApiBaseUrl(): string {
  // 本番環境（Vercel）では相対パスを使用
  // 開発環境でも相対パスを使用（Viteのプロキシ設定がある場合）
  // 環境変数で明示的に指定されている場合のみ使用
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // デフォルトは相対パス（同じオリジン）
  return "";
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // URLが既に絶対URL（http://またはhttps://で始まる）の場合はそのまま使用
  // そうでない場合はベースURLを追加
  const baseUrl = getApiBaseUrl();
  const fullUrl = url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${baseUrl}${url}`;

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // queryKeyを結合してパスを作成
    const path = queryKey.join("/") as string;
    const baseUrl = getApiBaseUrl();
    // パスが既に絶対URLの場合はそのまま使用、そうでない場合はベースURLを追加
    const fullUrl = path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${baseUrl}${path}`;

    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
