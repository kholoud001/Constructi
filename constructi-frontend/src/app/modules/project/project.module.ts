import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectProgressComponent } from './project-progress/project-progress.component';
import {NgChartsConfiguration, NgChartsModule} from "ng2-charts";


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectProgressComponent
  ],
    imports: [
        CommonModule,
        ProjectRoutingModule,
        // NgChartsModule
    ],
  // providers: [
  //   { provide: NgChartsConfiguration, useValue: { generateColors: false } }
  // ]
})
export class ProjectModule { }
