import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UnauthorizedComponent} from './shared/components/unauthorized/unauthorized.component';

const routes: Routes = [

  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: 'admin', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
