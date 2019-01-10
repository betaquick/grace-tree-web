import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { ContainerComponent } from '../layout/container/container.component';
import { AuthGuard } from '../auth/auth.guard';
import { CompanyProfileComponent } from './company-profile/company-profile.component';

const routes: Routes = [{
  path: 'company',
  component: ContainerComponent,
  canActivate: [AuthGuard],
  children: [{
    path: '',
    children: [
      { path: 'dashboard', component: CompanyDashboardComponent },
      { path: 'profile', component: CompanyProfileComponent }
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
