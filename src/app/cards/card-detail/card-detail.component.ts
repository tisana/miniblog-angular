import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../models/card';
import {ActivatedRoute} from '@angular/router';
import {CardService} from '../services/card.service';
import {Location} from '@angular/common';
import {Category} from '../models/category';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  @Input() card: Card = new Card();
  categories: Category[];

  // selectedCategory: number;

  constructor(private route: ActivatedRoute, private cardService: CardService, private location: Location) {
  }

  ngOnInit(): void {
    this.getCategories();
    this.getCard();
  }

  getCard(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (id) { // edit mode
      this.cardService.getCard(id).subscribe(card => {
        this.card = card;
      });
    } else { // create mode
      this.card = new Card();
    }
  }

  getCategories(): void {
    this.cardService.getCategories().subscribe(categories => this.categories = categories);
  }

  goBack(): void {
    this.location.back();
  }

  onSave(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(this.card);
    if (id) {
      console.log('edit');
      this.cardService.updateCard(this.card).subscribe(card => {
        console.log('update complete');
        console.log(card);
      });
    } else {
      console.log('new');
      this.cardService.addCard(this.card).subscribe(card => {
        console.log('add complete');
        console.log(card);
      });
    }
  }
}
