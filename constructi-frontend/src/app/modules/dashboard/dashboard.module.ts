import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ArchitectDashboardComponent } from './architect-dashboard/architect-dashboard.component';
import { WorkerDashboardComponent } from './worker-dashboard/worker-dashboard.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ArchitectDashboardComponent,
    WorkerDashboardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
