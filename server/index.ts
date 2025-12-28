import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// CORS設定
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // 同じオリジンからのリクエスト、またはVercel環境ではすべてのオリジンからのリクエストを許可
  if (origin || process.env.VERCEL) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24時間
  }
  
  // OPTIONSリクエストの処理（プリフライトリクエスト）
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// Vercel環境かどうかを判定（VercelではVERCEL環境変数が設定される）
const isVercel = !!process.env.VERCEL;

// アプリケーションの初期化
async function initializeApp() {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production" && !isVercel) {
    // ローカル本番環境でのみ静的ファイルを配信
    serveStatic(app);
  } else if (!isVercel) {
    // ローカル開発環境でのみViteを設定
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }
}

// 初期化を実行（エクスポートしてVercel環境で使用）
export const appInitialized = initializeApp();

// ローカル開発時のみサーバーを起動
if (!isVercel) {
  appInitialized.then(() => {
  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
      port,
    () => {
      log(`serving on port ${port}`);
    },
  );
  });
}

// Vercel環境ではappをエクスポート（初期化を待つ）
if (isVercel) {
  // Vercel環境では初期化を待ってからエクスポート
  appInitialized.then(() => {
    // 初期化完了
  });
}

export default app;
