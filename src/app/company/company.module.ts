import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyService } from './company.service';
import { CompanyCrewComponent } from './company-crew/company-crew.component';
import { CompanyTemplateComponent, TemplatePreviewComponent, UpdateCompanyTemplateComponent } from './company-templates';
import { NewCompanyCrewComponent } from './company-crew/new/new-company-crew.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyDeliveriesComponent } from './company-deliveries/company-deliveries.component';
import { SetupDeliveryComponent } from './setup-delivery/setup-delivery.component';
import { SharedModule } from '../shared/shared.module';
import { ManageDeliveryComponent } from './manage-delivery/manage-delivery.component';
import { CrewProfileComponent } from './crew-profile/crew-profile.component';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA-cbjuj3-Cr63P-Y-6GfSRPcLh5FZISfE'
    }),
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    CustomFormsModule,
    SharedModule,
    GooglePlaceModule
  ],
  providers: [CompanyService],
  declarations: [
    CompanyDashboardComponent,
    CompanyProfileComponent,
    CompanyCrewComponent,
    NewCompanyCrewComponent,
    CompanySearchComponent,
    CompanyDeliveriesComponent,
    ManageDeliveryComponent,
    SetupDeliveryComponent,
    CrewProfileComponent,
    CompanyTemplateComponent,
    TemplatePreviewComponent,
    UpdateCompanyTemplateComponent
  ]
})
export class CompanyModule { }
