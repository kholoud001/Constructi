import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskPayementProcessComponent} from './task-payement-process/task-payement-process.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskListComponent} from './task-list/task-list.component';
import {TaskAddComponent} from './task-add/task-add.component';

const routes: Routes = [

  { path: 'task-payment-details/:id', component: TaskPayementProcessComponent },
  { path: 'detail/:id', component: TaskDetailComponent },
  { path: '', component: TaskListComponent },
  { path: 'add', component: TaskAddComponent },
  { path: 'edit/:id', component: TaskAddComponent },
  { path: 'task-payment-details/:id', component: TaskPayementProcessComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
