import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectDetailComponent} from './project-detail/project-detail.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectProgressComponent} from './project-progress/project-progress.component';
import {MyProjectsComponent} from './my-projects/my-projects.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: ':id/details', component: ProjectDetailComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
