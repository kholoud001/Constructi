import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskPayementProcessComponent} from './task-payement-process/task-payement-process.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';

const routes: Routes = [

  { path: 'task-payment-details/:id', component: TaskPayementProcessComponent },
  { path: 'detail/:id', component: TaskDetailComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
