// Vercel Serverless Function entry point
import type { IncomingMessage, ServerResponse } from "http";
import app, { appInitialized } from "../server/index";

// Vercel環境では、リクエストハンドラーで初期化を待つ
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  // 初期化が完了するまで待つ
  await appInitialized;
  // appにリクエストを渡す（Expressは標準的なNode.jsのリクエスト/レスポンスを受け入れる）
  app(req as any, res as any);
}

