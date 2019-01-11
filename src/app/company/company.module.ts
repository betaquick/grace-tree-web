import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyService } from './company.service';

@NgModule({
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    CustomFormsModule
  ],
  providers: [CompanyService],
  declarations: [CompanyDashboardComponent, CompanyProfileComponent]
})
export class CompanyModule { }
