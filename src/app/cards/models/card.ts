export interface Card {
  id?: number;
  name: string;
  status: string;
  content: string;
  authorId?: number;
  authorUserName: string;
  categoryId?: number;
  categoryName: string;
}
