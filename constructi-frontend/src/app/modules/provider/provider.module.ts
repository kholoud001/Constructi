import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderDetailComponent } from './provider-detail/provider-detail.component';
import { ProviderFormComponent } from './provider-form/provider-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ProviderListComponent,
    ProviderDetailComponent,
    ProviderFormComponent
  ],
    imports: [
        CommonModule,
        ProviderRoutingModule,
        ReactiveFormsModule,
        FaIconComponent,
        FormsModule
    ]
})
export class ProviderModule { }
