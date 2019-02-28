import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { MenuItems } from './menu-items/menu-items';
import { SpinnerComponent } from './spinner/spinner.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { PlacesAutocompleteDirective } from './places-autocomplete/places-autocomplete.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent,
    PlacesAutocompleteDirective
  ],
  declarations: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent,
    PlacesAutocompleteDirective
  ],
  providers: [
    MenuItems
  ]
})
export class SharedModule { }
