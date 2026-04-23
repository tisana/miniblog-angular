export class Card {
  id?: number;
  name = '';
  status = 'DRAFT';
  content = '';
  authorId?: number;
  authorUsername = '';
  categoryId?: number;
  categoryName = '';
  // TODO remove when implement proper auth system
  authorPassword?: string;
}
