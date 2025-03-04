import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { CardComponent } from './card/card.component';
import { UpdateComponent } from './update/update.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    CardComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FaIconComponent
  ]
})
export class ProfileModule { }
