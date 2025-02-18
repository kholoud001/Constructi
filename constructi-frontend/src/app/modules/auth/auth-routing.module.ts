import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {AuthReverseGuard} from '../../shared/guards/auth-reverse.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent ,
    canActivate: [AuthReverseGuard]
  },
  { path: 'register', component: RegisterComponent ,
    canActivate: [AuthReverseGuard]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent ,
    canActivate: [AuthReverseGuard]
  },
  { path: 'reset-password', component: ResetPasswordComponent ,
    canActivate: [AuthReverseGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
