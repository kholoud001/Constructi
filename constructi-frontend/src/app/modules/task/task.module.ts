import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskPayementProcessComponent } from './task-payement-process/task-payement-process.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    TaskPayementProcessComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    FaIconComponent
  ]
})
export class TaskModule { }
