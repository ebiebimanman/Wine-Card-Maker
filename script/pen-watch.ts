/**
 * Watches Wine-Card-Maker.pen for changes.
 * When the file is saved, creates .pen-pending-sync so Cursor Agent can
 * sync the design to client code (via Pencil MCP).
 *
 * Run with: npm run pen:watch
 * Or together with dev server: npm run dev:with-pen
 */

import { watch } from "fs";
import { writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PEN_FILE = join(ROOT, "Wine-Card-Maker.pen");
const TRIGGER_FILE = join(ROOT, ".pen-pending-sync");

function createTrigger() {
  const payload = JSON.stringify({ at: new Date().toISOString() }) + "\n";
  writeFile(TRIGGER_FILE, payload).then(() => {
    console.log("[pen-watch] Pencil の変更を検知しました。");
    console.log("[pen-watch] Cursor で「反映して」や「.pen を同期して」と送ると client が更新されます。");
  }).catch((err) => {
    console.error("[pen-watch] トリガーファイルの作成に失敗:", err);
  });
}

console.log("[pen-watch] 監視中:", PEN_FILE);

watch(PEN_FILE, (eventType) => {
  if (eventType === "change") {
    createTrigger();
  }
}, (err) => {
  if (err) {
    console.error("[pen-watch] 監視エラー:", err);
    process.exit(1);
  }
});
