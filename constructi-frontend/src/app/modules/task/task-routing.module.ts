import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskPayementProcessComponent} from './task-payement-process/task-payement-process.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TaskListComponent} from './task-list/task-list.component';
import {TaskAddComponent} from './task-add/task-add.component';
import {AuthGuard} from '../../shared/guards/auth.guard';

const routes: Routes = [

  { path: 'task-payment-details/:id', component: TaskPayementProcessComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'detail/:id', component: TaskDetailComponent },

  { path: '', component: TaskListComponent  ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'add', component: TaskAddComponent  ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'edit/:id', component: TaskAddComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'task-payment-details/:id', component: TaskPayementProcessComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
