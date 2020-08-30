import {Injectable} from '@angular/core';
import {Card} from '../models/card';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private REST_API_SERVER = 'http://localhost:8081';
  private CARD_RESOURCE = this.REST_API_SERVER + '/api/cards';

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
}
