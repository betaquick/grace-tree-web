import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { MenuItems } from './menu-items/menu-items';
import { SpinnerComponent } from './spinner/spinner.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { SanitizeHtmlPipe, NewlineToBreakTag } from './pipes';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


import { UserDeliveryPreferenceComponent } from '../user/user-deliveries/preferences/preferences.component';
import { UserAddressComponent } from '../user/user-address/user-address.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      cancelButtonClass: 'btn'
    })
  ],
  exports: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent,
    SanitizeHtmlPipe,
    NgbPaginationModule,
    NewlineToBreakTag,
    UserDeliveryPreferenceComponent,
    UserAddressComponent,
    SweetAlert2Module
  ],
  declarations: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent,
    SanitizeHtmlPipe,
    NewlineToBreakTag,
    UserDeliveryPreferenceComponent,
    UserAddressComponent
  ],
  providers: [
    MenuItems
  ]
})
export class SharedModule { }
