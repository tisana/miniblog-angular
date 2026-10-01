import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Card} from '../models/card';
import {ActivatedRoute, Router} from '@angular/router';
import {CardService} from '../services/card.service';
import {Location} from '@angular/common';
import {Category} from '../models/category';
import {Author} from '../models/author';
import {apiErrorMessage} from '../../services/api-error';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-card-detail',
  standalone: false,
  templateUrl: './card-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  @Input() card: Card = new Card();
  categories: Category[] = [];
  authors: Author[] = [];
  error = '';
  saving = false;
  isEdit = false;
  currentId = 0;

  constructor(private route: ActivatedRoute, private router: Router, private cardService: CardService, private location: Location) {
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    this.currentId = routeId ? Number(routeId) : 0;
    this.isEdit = this.currentId > 0;
    this.getCategories();
    this.cardService.getAuthors().subscribe({next: authors => this.authors = authors, error: error => this.showError(error)});
    this.getCard();
  }

  getCard(): void {
    if (this.isEdit) { // edit mode
      this.cardService.getCard(this.currentId).subscribe({next: card => {
        this.card = card;
      }, error: error => this.showError(error)});
    } else { // create mode
      this.card = new Card();
    }
  }

  getCategories(): void {
    this.cardService.getCategories().subscribe({next: categories => this.categories = categories, error: error => this.showError(error)});
  }

  goBack(): void {
    this.location.back();
  }

  onSave(): void {
    if (this.saving) { return; }
    this.error = '';
    this.saving = true;
    const request = this.isEdit ? this.cardService.updateCard(this.card) : this.cardService.addCard(this.card);
    request.subscribe({next: card => {
      this.card = card;
      this.saving = false;
      this.router.navigate(['/cards']);
    }, error: error => this.showError(error)});
  }

  onDelete(): void {
    if (!this.isEdit || this.saving) { return; }
    this.error = '';
    this.saving = true;
    this.cardService.deleteCard(this.card).subscribe({next: () => {
      this.saving = false;
      this.router.navigate(['/cards']);
    }, error: error => this.showError(error)});
  }

  private showError(error: HttpErrorResponse): void {
    this.error = apiErrorMessage(error);
    this.saving = false;
  }
}
