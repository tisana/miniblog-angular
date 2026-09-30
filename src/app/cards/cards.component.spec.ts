import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {Subject} from 'rxjs';
import {CardsComponent} from './cards.component';
import {Card} from './models/card';
import {CardService} from './services/card.service';

describe('CardsComponent', () => {
  let fixture: ComponentFixture<CardsComponent>;
  let cardService: jasmine.SpyObj<CardService>;
  let cards: Subject<Card[]>;

  beforeEach(async () => {
    cards = new Subject<Card[]>();
    cardService = jasmine.createSpyObj<CardService>('CardService', ['getCards']);
    cardService.getCards.and.returnValue(cards.asObservable());

    await TestBed.configureTestingModule({
      declarations: [CardsComponent],
      imports: [CommonModule, RouterModule.forRoot([]), MatButtonModule, MatCardModule,
        MatGridListModule, MatIconModule],
      providers: [{provide: CardService, useValue: cardService}]
    }).compileComponents();

    fixture = TestBed.createComponent(CardsComponent);
  });

  afterEach(() => cards.complete());

  it('calls CardService.getCards on initialization', () => {
    fixture.detectChanges();

    expect(cardService.getCards).toHaveBeenCalledOnceWith();
  });

  it('renders cards emitted asynchronously by CardService', async () => {
    fixture.detectChanges();
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.blog-card').length).toBe(0);

    fixture.ngZone!.run(() => {
      setTimeout(() => cards.next([{
        id: 7, name: 'Async published blog', content: 'Arrived after initialization',
        status: 'PUBLISH', authorId: 3, authorUsername: 'alice', categoryId: 2,
        categoryName: 'Technology'
      }, {
        id: 8, name: 'Async draft blog', content: 'Draft content', status: 'DRAFT',
        authorId: 4, authorUsername: 'bob', categoryId: 2, categoryName: 'Technology'
      }]), 0);
    });
    // Let Angular render the response; forcing detection here would hide an OnPush regression.
    await fixture.whenStable();

    const renderedCards = fixture.nativeElement.querySelectorAll('.blog-card') as NodeListOf<HTMLElement>;
    expect(renderedCards.length).toBe(2);
    expect(renderedCards[0]?.querySelector('mat-card-title')?.textContent).toContain('Async published blog');
    expect(renderedCards[0]?.querySelector('mat-card-content')?.textContent).toContain('Arrived after initialization');
    expect(renderedCards[0]?.querySelectorAll('mat-card-title')[1]?.textContent).toContain('alice');
    expect(renderedCards[0]?.querySelector('.status-icon mat-icon')?.textContent).toContain('trip_origin');
    expect(renderedCards[0]?.querySelector('.status-icon mat-icon')?.classList.contains('color_green')).toBeTrue();
    expect(renderedCards[1]?.querySelector('mat-card-title')?.textContent).toContain('Async draft blog');
    expect(renderedCards[1]?.querySelectorAll('mat-card-title')[1]?.textContent).toContain('bob');
    expect(renderedCards[1]?.querySelector('.status-icon mat-icon')?.classList.contains('color_red')).toBeTrue();
  });
});
