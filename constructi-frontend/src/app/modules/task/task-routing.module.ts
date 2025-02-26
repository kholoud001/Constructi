import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskPayementProcessComponent} from './task-payement-process/task-payement-process.component';

const routes: Routes = [

  { path: 'task-payment-details/:id', component: TaskPayementProcessComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
