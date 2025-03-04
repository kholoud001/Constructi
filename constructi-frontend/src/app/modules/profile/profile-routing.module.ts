import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UpdateComponent} from './update/update.component';
import {CardComponent} from './card/card.component';

const routes: Routes = [
  { path: 'card', component: CardComponent },
  { path: 'update', component: UpdateComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
