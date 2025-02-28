import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubtaskRoutingModule } from './subtask-routing.module';
import { SubtaskListComponent } from './subtask-list/subtask-list.component';
import { SubtaskDetailComponent } from './subtask-detail/subtask-detail.component';
import { SubtaskAddComponent } from './subtask-add/subtask-add.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    SubtaskListComponent,
    SubtaskDetailComponent,
    SubtaskAddComponent
  ],
    imports: [
        CommonModule,
        SubtaskRoutingModule,
        FaIconComponent
    ]
})
export class SubtaskModule { }
