import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFormsModule } from 'ng5-validation';
import { UiSwitchModule } from 'ngx-ui-switch';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserService } from './user.service';
import { SharedModule } from '../shared/shared.module';
import { UserDeliveriesComponent } from './user-deliveries/user-deliveries.component';
import { UpdateDeliveryComponent } from './user-deliveries/update-delivery/update-delivery.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    CustomFormsModule,
    UiSwitchModule,
    SharedModule,
    GooglePlaceModule,
  ],
  providers: [UserService],
  declarations: [
    UserDashboardComponent,
    UserProfileComponent,
    UserDeliveriesComponent,
    UpdateDeliveryComponent,
  ]
})
export class UserModule { }
