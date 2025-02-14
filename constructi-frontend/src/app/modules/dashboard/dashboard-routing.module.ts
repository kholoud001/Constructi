import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {ArchitectDashboardComponent} from './architect-dashboard/architect-dashboard.component';
import {WorkerDashboardComponent} from './worker-dashboard/worker-dashboard.component';
import {AuthGuard} from '../../shared/guards/auth.guard';

const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'architect', component: ArchitectDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ARCHITECT' }
  },
  { path: 'worker', component: WorkerDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'WORKER' }
  },


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule{

}
