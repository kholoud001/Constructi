import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MaterialListComponent} from './material-list/material-list.component';
import {MaterialAddComponent} from './material-add/material-add.component';
import {MaterialUpdateComponent} from './material-update/material-update.component';
import {AuthGuard} from '../../shared/guards/auth.guard';

const routes: Routes = [
  { path: '', component: MaterialListComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'add', component: MaterialAddComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'edit/:id', component: MaterialUpdateComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
