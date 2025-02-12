import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialAddComponent } from './material-add/material-add.component';


@NgModule({
  declarations: [
    MaterialListComponent,
    MaterialAddComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule
  ]
})
export class MaterialModule { }
