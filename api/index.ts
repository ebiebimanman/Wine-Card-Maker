// Vercel Serverless Function entry point
import type { Request, Response } from "express";
import app, { appInitialized } from "../server/index";

// Vercel環境では、リクエストハンドラーで初期化を待つ
const handler = async (req: Request, res: Response) => {
  // 初期化が完了するまで待つ
  await appInitialized;
  // appにリクエストを渡す
  app(req, res);
};

export default handler;

