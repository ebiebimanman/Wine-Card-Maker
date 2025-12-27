import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wineCards = pgTable("wine_cards", {
  id: serial("id").primaryKey(),
  wineName: text("wine_name").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  pairedFood: text("paired_food").array().notNull(),
  myComment: text("my_comment").array().notNull(),
  partnerComment: text("partner_comment").array().notNull(),
  myRating: integer("my_rating").notNull(),
  partnerRating: integer("partner_rating").notNull(),
  themeColor: text("theme_color").notNull(), // 'red' | 'white'
  wineImage: text("wine_image"), // Base64 encoded image or URL
});

export const insertWineCardSchema = createInsertSchema(wineCards).pick({
  wineName: true,
  location: true,
  price: true,
  pairedFood: true,
  myComment: true,
  partnerComment: true,
  myRating: true,
  partnerRating: true,
  themeColor: true,
  wineImage: true,
}).extend({
  wineImage: z.string().optional(),
});

export const COMMENT_OPTIONS = [
  "香りが良い",
  "飲みやすい",
  "後味が良い",
  "深い味わい",
  "フルーティー",
  "華やか",
  "しっかりした味",
  "爽やか",
  "上品",
  "クリーミー",
] as const;

export const PAIRED_FOOD_OPTIONS = [
  "チーズ",
  "ステーキ",
  "魚料理",
  "和食",
  "パスタ",
  "チョコレート",
  "デザート",
  "海鮮",
  "フルーツ",
  "前菜",
] as const;

export type InsertWineCard = z.infer<typeof insertWineCardSchema>;
export type WineCard = typeof wineCards.$inferSelect;
