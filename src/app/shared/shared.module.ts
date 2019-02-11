import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { MenuItems } from './menu-items/menu-items';
import { SpinnerComponent } from './spinner/spinner.component';
import { DeliveryComponent } from './delivery/delivery.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent
  ],
  declarations: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent
  ],
  providers: [
    MenuItems
  ]
})
export class SharedModule { }
