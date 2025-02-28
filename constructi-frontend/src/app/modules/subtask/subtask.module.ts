import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubtaskRoutingModule } from './subtask-routing.module';
import { SubtaskListComponent } from './subtask-list/subtask-list.component';
import { SubtaskDetailComponent } from './subtask-detail/subtask-detail.component';
import { SubtaskAddComponent } from './subtask-add/subtask-add.component';


@NgModule({
  declarations: [
    SubtaskListComponent,
    SubtaskDetailComponent,
    SubtaskAddComponent
  ],
  imports: [
    CommonModule,
    SubtaskRoutingModule
  ]
})
export class SubtaskModule { }
