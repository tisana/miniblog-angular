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
  @Input() card: Card;
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
    this.cardService.getCard(id).subscribe(card => {
      this.card = card;
      // this.selectedCategory = this.card.categoryId;
    });
  }

  getCategories(): void {
    this.cardService.getCategories().subscribe(categories => this.categories = categories);
  }

  goBack(): void {
    this.location.back();
  }

}
