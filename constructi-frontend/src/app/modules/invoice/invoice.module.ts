import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';


@NgModule({
  declarations: [
    InvoiceListComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
