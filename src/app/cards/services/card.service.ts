import {Injectable} from '@angular/core';
import {Card} from '../models/card';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private REST_API_SERVER = 'http://localhost:8081';
  private CARD_RESOURCE = this.REST_API_SERVER + '/api/cards';
  private readonly token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTg2MTI4MjYsImV4cCI6MTYzMDE0ODgyNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXSwiYXV0aG9yaXRpZXMiOiJST0xFX1VTRVIiLCJhdXRoIjoiUk9MRV9VU0VSIn0.Qpdkc4HNE_Nixov7Xh9oC4CMjJG6aEd4P_e5Uv-xBXBNcWzchPOLpenZjeoE_5In8Q8lZnKWeqeVfsEyIhqhbA';

  constructor(private httpclient: HttpClient) {
  }

  getCards(): Observable<Card[]> {
    return this.httpclient.get<Card[]>(this.CARD_RESOURCE);
  }

  getCard(id: number): Observable<Card> {
    return this.httpclient.get<Card>(this.CARD_RESOURCE + '/' + id);
  }

  getCategories(): Observable<Category[]> {
    return this.httpclient.get<Category[]>(this.REST_API_SERVER + '/api/categories');
  }

  addCard(card: Card): Observable<Card> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token
      })
    };
    return this.httpclient.post<Card>(this.CARD_RESOURCE, card, httpOptions);
  }

  updateCard(card: Card): Observable<Card> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token
      })
    };
    return this.httpclient.put<Card>(this.CARD_RESOURCE, card, httpOptions);
  }
}
