import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ArchitectDashboardComponent } from './architect-dashboard/architect-dashboard.component';
import { WorkerDashboardComponent } from './worker-dashboard/worker-dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ArchitectDashboardComponent,
    WorkerDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
