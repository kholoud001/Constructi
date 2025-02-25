import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectProgressComponent } from './project-progress/project-progress.component';
import {NgChartsConfiguration, NgChartsModule} from "ng2-charts";
import {NgCircleProgressModule} from 'ng-circle-progress';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { MyProjectDetailComponent } from './my-project-detail/my-project-detail.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectProgressComponent,
    MyProjectsComponent,
    MyProjectDetailComponent
  ],
    imports: [
        CommonModule,
        ProjectRoutingModule,
        NgChartsModule,
        NgCircleProgressModule.forRoot({}),
        FaIconComponent,
        FormsModule
    ],
  providers: []
})
export class ProjectModule { }
