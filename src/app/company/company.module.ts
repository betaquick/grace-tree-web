import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyComponent } from './company/company.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyRoutingModule
  ],
  declarations: [CompanyDashboardComponent, CompanyComponent]
})
export class CompanyModule { }
