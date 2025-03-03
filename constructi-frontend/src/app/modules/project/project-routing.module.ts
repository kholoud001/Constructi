import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectDetailComponent} from './project-detail/project-detail.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectProgressComponent} from './project-progress/project-progress.component';
import {MyProjectsComponent} from './my-projects/my-projects.component';
import {MyProjectDetailComponent} from './my-project-detail/my-project-detail.component';
import {AuthGuard} from '../../shared/guards/auth.guard';
import {ProjectAddComponent} from './project-add/project-add.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'add', component: ProjectAddComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

  { path: ':id/details', component: ProjectDetailComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'my-projects',
    component: MyProjectsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ARCHITECT', 'WORKER'] }
  },
  {
    path: ':id/my-tasks',
    component: MyProjectDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ARCHITECT', 'WORKER'] }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
