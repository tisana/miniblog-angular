export class Card {
  id?: number;
  name: string;
  status: string;
  content: string;
  authorId?: number;
  authorUsername: string;
  categoryId?: number;
  categoryName: string;
  // TODO remove when implement proper auth system
  authorPassword?: string;
}
