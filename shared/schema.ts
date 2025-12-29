import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wineCards = pgTable("wine_cards", {
  id: serial("id").primaryKey(),
  wineName: text("wine_name").notNull(),
  origin: text("origin"), // 産地
  variety: text("variety"), // 品種
  location: text("location"),
  price: integer("price"),
  pairedFood: text("paired_food").array(),
  myComment: text("my_comment").array(),
  partnerComment: text("partner_comment").array(),
  myRating: integer("my_rating").notNull(),
  partnerRating: integer("partner_rating").notNull(),
  themeColor: text("theme_color").notNull(), // 'red' | 'white'
  wineImage: text("wine_image"), // Base64 encoded image or URL
});

export const insertWineCardSchema = createInsertSchema(wineCards).pick({
  wineName: true,
  origin: true,
  variety: true,
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
  origin: z.string().optional(),
  variety: z.string().optional(),
  location: z.string().optional(),
  price: z.number().optional(),
  pairedFood: z.string().array().optional(),
  myComment: z.string().array().optional(),
  partnerComment: z.string().array().optional(),
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
