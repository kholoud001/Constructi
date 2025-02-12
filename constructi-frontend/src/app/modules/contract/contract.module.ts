import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractRoutingModule } from './contract-routing.module';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';


@NgModule({
  declarations: [
    ContractListComponent,
    ContractDetailComponent
  ],
  imports: [
    CommonModule,
    ContractRoutingModule
  ]
})
export class ContractModule { }
