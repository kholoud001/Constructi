import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskPayementProcessComponent } from './task-payement-process/task-payement-process.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormsModule} from "@angular/forms";
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskAddComponent } from './task-add/task-add.component';


@NgModule({
  declarations: [
    TaskPayementProcessComponent,
    TaskDetailComponent,
    TaskListComponent,
    TaskAddComponent,
  ],
    imports: [
        CommonModule,
        TaskRoutingModule,
        FaIconComponent,
        FormsModule
    ]
})
export class TaskModule { }
