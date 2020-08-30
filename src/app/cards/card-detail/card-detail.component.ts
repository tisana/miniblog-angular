import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../models/card';
import {ActivatedRoute, Router} from '@angular/router';
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
  isEdit: boolean;
  currentId: number;

  constructor(private route: ActivatedRoute, private router: Router, private cardService: CardService, private location: Location) {
  }

  ngOnInit(): void {
    this.currentId = +this.route.snapshot.paramMap.get('id');
    this.isEdit = !!(this.currentId);
    this.getCategories();
    this.getCard();
  }

  getCard(): void {
    if (this.isEdit) { // edit mode
      this.cardService.getCard(this.currentId).subscribe(card => {
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
    console.log(this.card);
    if (this.isEdit) {
      this.cardService.updateCard(this.card).subscribe(card => {
        console.log('update complete');
        console.log(card);
      });
    } else {
      this.cardService.addCard(this.card).subscribe(card => {
        console.log('add complete');
        console.log(card);
        this.router.navigate(['/cards']);
      });
    }
  }

  onDelete(): void {
    console.log('delete card : ' + this.card.id);
    this.cardService.deleteCard(this.card).subscribe(() => {
      console.log('delete success');
      this.router.navigate(['/cards']);
    });
  }
}
