import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { AgmCoreModule } from '@agm/core';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyService } from './company.service';
import { CompanyCrewComponent } from './company-crew/company-crew.component';
import { NewCompanyCrewComponent } from './company-crew/new/new-company-crew.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyDeliveriesComponent } from './company-deliveries/company-deliveries.component';
import { googleMaps } from '../layout';
import { ModalBasicComponent } from '../shared/modal-basic/modal-basic.component';
import { SetupDeliveryComponent } from './setup-delivery/setup-delivery.component';

@NgModule({
  imports: [
    AgmCoreModule.forRoot(googleMaps),
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    CustomFormsModule
  ],
  providers: [CompanyService],
  declarations: [
    CompanyDashboardComponent,
    CompanyProfileComponent,
    CompanyCrewComponent,
    ModalBasicComponent,
    NewCompanyCrewComponent,
    CompanySearchComponent,
    CompanyDeliveriesComponent,
    SetupDeliveryComponent
  ]
})
export class CompanyModule { }
