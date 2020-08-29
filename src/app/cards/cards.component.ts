import { Component, OnInit } from '@angular/core';
import {Card} from './card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  card: Card = {
    name: 'Card1',
    status: 'DRAFT',
    content: 'Test Content',
    authorId: 1,
    authorUserName: 'Seph',
    categoryId: 1,
    categoryName: 'Poll'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
