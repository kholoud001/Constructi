import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../shared/guards/auth.guard';
import {ProviderListComponent} from './provider-list/provider-list.component';
import {ProviderDetailComponent} from './provider-detail/provider-detail.component';
import {ProviderFormComponent} from './provider-form/provider-form.component';

const routes: Routes = [

  { path: '', component: ProviderListComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'add', component: ProviderFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'edit/:id', component: ProviderFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { path: ':id', component: ProviderDetailComponent ,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
