import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Card} from '../models/card';
import {Author} from '../models/author';
import {Category} from '../models/category';

interface CardResponse {
  id?: number;
  name: string;
  status: string;
  content?: string | null;
  author?: Author | null;
  category?: Category | null;
}

@Injectable({providedIn: 'root'})
export class CardService {
  private readonly api = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<CardResponse[]>(this.api + '/cards').pipe(map(cards => cards.map(card => this.fromResponse(card))));
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<CardResponse>(this.api + '/cards/' + id).pipe(map(card => this.fromResponse(card)));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api + '/categories');
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.api + '/authors');
  }

  addCard(card: Card): Observable<Card> {
    return this.http.post<CardResponse>(this.api + '/cards', this.toRequest(card)).pipe(map(saved => this.fromResponse(saved)));
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<CardResponse>(this.api + '/cards/' + card.id, this.toRequest(card)).pipe(map(saved => this.fromResponse(saved)));
  }

  deleteCard(card: Card): Observable<void> {
    return this.http.delete<void>(this.api + '/cards/' + card.id);
  }

  private fromResponse(response: CardResponse): Card {
    return Object.assign(new Card(), {
      id: response.id, name: response.name, content: response.content ?? '', status: response.status,
      authorId: response.author?.id, authorUsername: response.author?.username ?? '',
      categoryId: response.category?.id, categoryName: response.category?.name ?? ''
    });
  }

  private toRequest(card: Card) {
    return {
      ...(card.id != null ? {id: card.id} : {}),
      name: card.name, content: card.content, status: card.status,
      author: card.authorId != null ? {id: card.authorId} : null,
      category: card.categoryId != null ? {id: card.categoryId} : null
    };
  }
}
