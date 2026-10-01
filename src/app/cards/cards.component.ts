import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Card} from './models/card';
import {CardService} from './services/card.service';
import {apiErrorMessage} from '../services/api-error';

@Component({
  selector: 'app-cards',
  standalone: false,
  templateUrl: './cards.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];
  error = '';

  constructor(private cardService: CardService) {
  }

  ngOnInit(): void {
    this.getCards();
  }

  getCards(): void {
    this.error = '';
    this.cardService.getCards().subscribe({next: cards => this.cards = cards, error: error => this.error = apiErrorMessage(error)});
  }
}
