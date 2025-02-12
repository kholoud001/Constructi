import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { CostTrackingComponent } from './cost-tracking/cost-tracking.component';
import { BudgetPlanningComponent } from './budget-planning/budget-planning.component';


@NgModule({
  declarations: [
    BudgetOverviewComponent,
    CostTrackingComponent,
    BudgetPlanningComponent
  ],
  imports: [
    CommonModule,
    BudgetRoutingModule
  ]
})
export class BudgetModule { }
