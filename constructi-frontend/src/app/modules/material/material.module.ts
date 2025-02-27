import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialAddComponent } from './material-add/material-add.component';
import { MaterialUpdateComponent } from './material-update/material-update.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    MaterialListComponent,
    MaterialAddComponent,
    MaterialUpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    FaIconComponent,
    ReactiveFormsModule
  ]
})
export class MaterialModule { }
