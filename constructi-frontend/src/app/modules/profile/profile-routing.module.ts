import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UpdateComponent} from './update/update.component';
import {CardComponent} from './card/card.component';
import {AuthGuard} from '../../shared/guards/auth.guard';
const routes: Routes = [
  { path: 'card', component: CardComponent ,
    canActivate: [AuthGuard]
  
  },
  { path: 'update', component: UpdateComponent ,
    canActivate: [AuthGuard]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
