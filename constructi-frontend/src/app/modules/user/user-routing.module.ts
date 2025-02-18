import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from './user-list/user-list.component';
import {AuthGuard} from '../../shared/guards/auth.guard';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [

  { path: 'users', component: UserListComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

  { path: 'user-detail/:id', component: UserDetailComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

  { path: 'user-edit/:id', component: UserEditComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
