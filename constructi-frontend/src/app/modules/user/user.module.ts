import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    UserDetailComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FaIconComponent,
    FormsModule
  ]
})
export class UserModule { }
