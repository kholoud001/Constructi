import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from './user-list/user-list.component';
import {AuthGuard} from '../../shared/guards/auth.guard';

const routes: Routes = [

  { path: 'users', component: UserListComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
