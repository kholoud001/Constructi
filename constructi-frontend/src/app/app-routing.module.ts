import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UnauthorizedComponent} from './shared/components/unauthorized/unauthorized.component';
import {HomePageComponent} from './shared/components/home-page/home-page.component';
import {AuthReverseGuard} from './shared/guards/auth-reverse.guard';

const routes: Routes = [

  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },

  { path: '', component: HomePageComponent },

  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },

  { path: 'projects', loadChildren: () => import('./modules/project/project.module').then(m => m.ProjectModule) },

  { path: 'tasks', loadChildren: () => import('./modules/task/task.module').then(m => m.TaskModule) },

  { path: 'subtasks', loadChildren: () => import('./modules/subtask/subtask.module').then(m => m.SubtaskModule) },


  { path: 'materials', loadChildren: () => import('./modules/material/material.module').then(m => m.MaterialModule) },


  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: 'admin', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
