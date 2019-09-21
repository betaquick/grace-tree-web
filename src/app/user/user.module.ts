import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { UiSwitchModule } from 'ngx-ui-switch';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { UserService } from './user.service';
import { SharedModule } from '../shared/shared.module';
import { UserDeliveriesComponent } from './user-deliveries/user-deliveries.component';
import { UserDeliveryPreferenceComponent } from './user-deliveries/preferences/preferences.component';
import { UpdateDeliveryComponent } from './user-deliveries/update-delivery/update-delivery.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    CustomFormsModule,
    UiSwitchModule,
    SharedModule,
    GooglePlaceModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      cancelButtonClass: 'btn'
    })
  ],
  providers: [UserService],
  declarations: [
    UserDashboardComponent,
    UserProfileComponent,
    UserAddressComponent,
    UserDeliveriesComponent,
    UpdateDeliveryComponent,
    UserDeliveryPreferenceComponent
  ]
})
export class UserModule { }
