import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SubtaskListComponent} from './subtask-list/subtask-list.component';
import {SubtaskAddComponent} from './subtask-add/subtask-add.component';
import {SubtaskDetailComponent} from './subtask-detail/subtask-detail.component';

const routes: Routes = [
  { path: 'parent/:parentTaskId', component: SubtaskListComponent },
  { path: 'add/:parentTaskId', component: SubtaskAddComponent },
  { path: 'edit/:id', component: SubtaskAddComponent },
  { path: 'detail/:id', component: SubtaskDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubtaskRoutingModule { }
