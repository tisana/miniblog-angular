import {Injectable} from '@angular/core';
import {Card} from '../models/card';
import {CARDS} from '../models/mock-card';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() {
  }

  getCards(): Observable<Card[]> {
    return of(CARDS);
  }

  getCard(id: number): Observable<Card> {
    return of(CARDS.find(card => card.id === id));
  }
}
