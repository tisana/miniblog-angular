import {Injectable} from '@angular/core';
import {Card} from '../models/card';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private REST_API_SERVER = 'http://localhost:8081';

  constructor(private httpclient: HttpClient) {
  }

  getCards(): Observable<Card[]> {
    return this.httpclient.get<Card[]>(this.REST_API_SERVER + '/api/cards');
  }

  getCard(id: number): Observable<Card> {
    return this.httpclient.get<Card>(this.REST_API_SERVER + '/api/cards/' + id);
  }
}
