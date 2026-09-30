import {CommonModule, Location} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {Card} from '../models/card';
import {Category} from '../models/category';
import {CardService} from '../services/card.service';
import {CardDetailComponent} from './card-detail.component';

describe('CardDetailComponent', () => {
  let fixture: ComponentFixture<CardDetailComponent>;
  let cardService: jasmine.SpyObj<CardService>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let route: {snapshot: {paramMap: ReturnType<typeof convertToParamMap>}};
  let card: Subject<Card>;
  let categories: Subject<Category[]>;
  let savedCard: Subject<Card>;
  let deletedCard: Subject<Card>;

  const editCard: Card = {
    id: 7, name: 'Delayed card title', content: 'Delayed card content', status: 'PUBLISH',
    authorId: 3, authorUsername: 'alice', authorPassword: 'secret', categoryId: 2,
    categoryName: 'Technology'
  };

  beforeEach(async () => {
    card = new Subject<Card>();
    categories = new Subject<Category[]>();
    savedCard = new Subject<Card>();
    deletedCard = new Subject<Card>();
    cardService = jasmine.createSpyObj<CardService>('CardService',
      ['getCard', 'getCategories', 'addCard', 'updateCard', 'deleteCard']);
    cardService.getCard.and.returnValue(card.asObservable());
    cardService.getCategories.and.returnValue(categories.asObservable());
    cardService.addCard.and.returnValue(savedCard.asObservable());
    cardService.deleteCard.and.returnValue(deletedCard.asObservable());
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));
    location = jasmine.createSpyObj<Location>('Location', ['back']);
    route = {snapshot: {paramMap: convertToParamMap({id: '7'})}};

    await TestBed.configureTestingModule({
      declarations: [CardDetailComponent],
      imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule,
        MatInputModule, MatSelectModule, NoopAnimationsModule],
      providers: [
        {provide: CardService, useValue: cardService},
        {provide: ActivatedRoute, useValue: route},
        {provide: Router, useValue: router},
        {provide: Location, useValue: location}
      ]
    }).compileComponents();
  });

  afterEach(() => {
    card.complete();
    categories.complete();
    savedCard.complete();
    deletedCard.complete();
  });

  async function initialize(): Promise<void> {
    fixture = TestBed.createComponent(CardDetailComponent);
    fixture.detectChanges();
    fixture.autoDetectChanges();
    await fixture.whenStable();
  }

  it('requests card 7 and categories for the edit route', async () => {
    await initialize();

    expect(cardService.getCard).toHaveBeenCalledOnceWith(7);
    expect(cardService.getCategories).toHaveBeenCalledOnceWith();
    expect(fixture.componentInstance.currentId).toBe(7);
    expect(fixture.componentInstance.isEdit).toBeTrue();
  });

  it('populates state and form controls from asynchronous card and category responses', async () => {
    await initialize();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe('');
    expect(fixture.componentInstance.categories).toEqual([]);

    fixture.ngZone!.run(() => {
      setTimeout(() => card.next({...editCard}), 0);
    });
    await fixture.whenStable();
    expect(fixture.componentInstance.card).toEqual(editCard);
    expect(root.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe('Delayed card title');
    expect(root.querySelector<HTMLTextAreaElement>('textarea[name="content"]')?.value).toBe('Delayed card content');
    expect(root.querySelector<HTMLInputElement>('input[name="authorUsername"]')?.value).toBe('alice');
    expect(root.querySelector<HTMLInputElement>('input[name="authorPassword"]')?.value).toBe('secret');
    expect(root.querySelector('mat-select[name="status"]')?.textContent).toContain('Publish');

    fixture.ngZone!.run(() => {
      setTimeout(() => categories.next([{id: 2, name: 'Technology'}, {id: 5, name: 'Travel'}]), 0);
    });
    // No forced detection after either response: delayed category options must render naturally.
    await fixture.whenStable();
    expect(fixture.componentInstance.categories).toEqual([{id: 2, name: 'Technology'}, {id: 5, name: 'Travel'}]);
    expect(root.querySelector('mat-select[name="categoryId"]')?.textContent).toContain('Technology');
  });

  it('creates a new card without requesting a card when the add route has no id', async () => {
    route.snapshot.paramMap = convertToParamMap({});
    await initialize();

    expect(fixture.componentInstance.card).toEqual(new Card());
    expect(fixture.componentInstance.currentId).toBe(0);
    expect(fixture.componentInstance.isEdit).toBeFalse();
    expect(cardService.getCard).not.toHaveBeenCalled();
    expect(cardService.getCategories).toHaveBeenCalledOnceWith();
    expect(fixture.nativeElement.querySelector('input[name="name"]').value).toBe('');
    expect(fixture.nativeElement.querySelector('button[color="warn"]').disabled).toBeTrue();
  });

  it('adds a card and navigates to /cards after the add response', async () => {
    route.snapshot.paramMap = convertToParamMap({});
    await initialize();
    const newCard: Card = {
      name: 'New blog', content: 'New content', status: 'DRAFT', authorUsername: 'bob',
      categoryId: 2, categoryName: 'Technology'
    };
    fixture.componentInstance.card = newCard;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.button-row button').click();

    expect(cardService.addCard).toHaveBeenCalledOnceWith(newCard);
    expect(cardService.updateCard).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    savedCard.next({...newCard, id: 9});
    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/cards']);
  });

  it('deletes an edited card and navigates to /cards after the delete response', async () => {
    await initialize();
    fixture.ngZone!.run(() => {
      setTimeout(() => card.next({...editCard}), 0);
    });
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button[color="warn"]').click();

    expect(cardService.deleteCard).toHaveBeenCalledOnceWith(editCard);
    expect(router.navigate).not.toHaveBeenCalled();
    deletedCard.next({...editCard});
    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/cards']);
  });
});
