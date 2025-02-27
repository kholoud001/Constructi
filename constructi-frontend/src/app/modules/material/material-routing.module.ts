import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MaterialListComponent} from './material-list/material-list.component';
import {MaterialAddComponent} from './material-add/material-add.component';
import {MaterialUpdateComponent} from './material-update/material-update.component';

const routes: Routes = [
  { path: '', component: MaterialListComponent },
  { path: 'add', component: MaterialAddComponent },
  { path: 'edit/:id', component: MaterialUpdateComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
