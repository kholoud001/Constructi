import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectDetailComponent} from './project-detail/project-detail.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectProgressComponent} from './project-progress/project-progress.component';
import {MyProjectsComponent} from './my-projects/my-projects.component';
import {MyProjectDetailComponent} from './my-project-detail/my-project-detail.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: ':id/details', component: ProjectDetailComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: ':id/my-tasks', component: MyProjectDetailComponent },


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
