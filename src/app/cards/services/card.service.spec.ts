import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {CardService} from './card.service';

describe('CardService backend contract', () => {
  let service: CardService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    service = TestBed.inject(CardService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('maps nested relations and handles cards without relations', () => {
    service.getCards().subscribe(cards => {
      expect(cards[0].authorUsername).toBe('alice');
      expect(cards[0].categoryId).toBe(2);
      expect(cards[1].authorUsername).toBe('');
      expect(cards[1].categoryName).toBe('');
    });
    http.expectOne('/api/cards').flush([
      {id: 7, name: 'Blog', status: 'DRAFT', content: 'Text', author: {id: 3, username: 'alice'}, category: {id: 2, name: 'Travel'}},
      {id: 8, name: 'Unassigned', status: 'DRAFT', content: null, author: null, category: null}
    ]);
  });

  it('updates the id route with nested relations and no legacy credentials', () => {
    service.updateCard({id: 7, name: 'Blog', content: 'Text', status: 'PUBLISH', authorId: 3,
      authorUsername: 'alice', categoryId: 2, categoryName: 'Travel'}).subscribe();
    const request = http.expectOne(req => req.method === 'PUT');
    expect(request.request.url).toBe('/api/cards/7');
    expect(request.request.body).toEqual({id: 7, name: 'Blog', content: 'Text', status: 'PUBLISH', author: {id: 3}, category: {id: 2}});
    request.flush({id: 7, name: 'Blog', status: 'PUBLISH'});
  });

  it('creates nested relations and omits an id for a new card', () => {
    service.addCard({name: 'New', content: '', status: 'DRAFT', authorId: 3, authorUsername: 'alice', categoryId: 2, categoryName: 'Travel'}).subscribe();
    const request = http.expectOne(req => req.method === 'POST');
    expect(request.request.body).toEqual({name: 'New', content: '', status: 'DRAFT', author: {id: 3}, category: {id: 2}});
    request.flush({id: 9, name: 'New', status: 'DRAFT'});
  });

  it('deletes without username or password query parameters', () => {
    service.deleteCard({id: 7, name: '', content: '', status: 'DRAFT', authorUsername: 'alice', categoryName: ''}).subscribe();
    const request = http.expectOne(req => req.method === 'DELETE');
    expect(request.request.urlWithParams).toBe('/api/cards/7');
    request.flush(null);
  });
});
