import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyDeliveriesComponent } from './company-deliveries/company-deliveries.component';
import { SetupDeliveryComponent } from './setup-delivery/setup-delivery.component';
import { ContainerComponent } from '../layout/container/container.component';
import { AuthGuard } from '../auth/auth.guard';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyCrewComponent } from './company-crew/company-crew.component';
import { NewCompanyCrewComponent } from './company-crew/new/new-company-crew.component';
import { ManageDeliveryComponent } from './manage-delivery/manage-delivery.component';
import { CrewProfileComponent } from './crew-profile/crew-profile.component';

const routes: Routes = [{
  path: 'company',
  component: ContainerComponent,
  canActivate: [AuthGuard],
  children: [{
    path: '',
    children: [
      { path: 'search', component: CompanySearchComponent },
      { path: 'dashboard', component: CompanyDashboardComponent },
      { path: 'deliveries', component: CompanyDeliveriesComponent },
      { path: 'deliveries/:deliveryId', component: ManageDeliveryComponent },
      { path: 'profile', component: CompanyProfileComponent },
      { path: 'crew-profile', component: CrewProfileComponent },
      { path: 'crews', component: CompanyCrewComponent },
      { path: 'crews/new', component: NewCompanyCrewComponent },
      { path: 'setup-delivery/:userId', component: SetupDeliveryComponent },
      { path: 'setup-delivery/:userId/delivery/:deliveryId', component: SetupDeliveryComponent },
      { path: '**', component: CompanySearchComponent }
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
