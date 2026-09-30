import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Card} from './models/card';
import {CardService} from './services/card.service';

@Component({
  selector: 'app-cards',
  standalone: false,
  templateUrl: './cards.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];

  constructor(private cardService: CardService) {
  }

  ngOnInit(): void {
    this.getCards();
  }

  getCards(): void {
    this.cardService.getCards().subscribe(cards => this.cards = cards);
  }
}
