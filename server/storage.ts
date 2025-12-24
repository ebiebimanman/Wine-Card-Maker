import {
  wineCards,
  type InsertWineCard,
  type WineCard
} from "@shared/schema";

export interface IStorage {
  createWineCard(card: InsertWineCard): Promise<WineCard>;
}

export class MemStorage implements IStorage {
  private cards: Map<number, WineCard>;
  private currentId: number;

  constructor() {
    this.cards = new Map();
    this.currentId = 1;
  }

  async createWineCard(insertCard: InsertWineCard): Promise<WineCard> {
    const id = this.currentId++;
    const card: WineCard = { ...insertCard, id };
    this.cards.set(id, card);
    return card;
  }
}

export const storage = new MemStorage();
