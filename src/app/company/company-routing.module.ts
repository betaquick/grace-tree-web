import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyComponent } from './company/company.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [{
  path: 'company',
  component: CompanyComponent,
  canActivate: [AuthGuard],
  children: [{
    path: '',
    children: [
      { path: '', component: CompanyDashboardComponent }
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
