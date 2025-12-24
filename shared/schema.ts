import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wineCards = pgTable("wine_cards", {
  id: serial("id").primaryKey(),
  wineName: text("wine_name").notNull(),
  myComment: text("my_comment").notNull(),
  partnerComment: text("partner_comment").notNull(),
  myRating: integer("my_rating").notNull(),
  partnerRating: integer("partner_rating").notNull(),
  themeColor: text("theme_color").notNull(), // 'red' | 'white'
});

export const insertWineCardSchema = createInsertSchema(wineCards).pick({
  wineName: true,
  myComment: true,
  partnerComment: true,
  myRating: true,
  partnerRating: true,
  themeColor: true,
});

export type InsertWineCard = z.infer<typeof insertWineCardSchema>;
export type WineCard = typeof wineCards.$inferSelect;
