import {Component, OnInit} from '@angular/core';
import {Card} from '../models/card';
import {ActivatedRoute} from '@angular/router';
import {CardService} from '../services/card.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  card: Card;

  constructor(private route: ActivatedRoute, private cardService: CardService, private location: Location) {
  }

  ngOnInit(): void {
    this.getCard();
  }

  getCard(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.cardService.getCard(id).subscribe(card => this.card = card);
  }

  goBack(): void {
    this.location.back();
  }

}
