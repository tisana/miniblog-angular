import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CardsComponent} from './cards/cards.component';
import {CardDetailComponent} from './cards/card-detail/card-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/cards', pathMatch: 'full'},
  {path: 'cards', component: CardsComponent},
  {path: 'card/edit/:id', component: CardDetailComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
