import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { MenuItems } from './menu-items/menu-items';
import { SpinnerComponent } from './spinner/spinner.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { SanitizeHtmlPipe, NewlineToBreakTag } from './pipes';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbPaginationModule.forRoot()
  ],
  exports: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent,
    SanitizeHtmlPipe,
    NgbPaginationModule,
    NewlineToBreakTag
  ],
  declarations: [
    ModalBasicComponent,
    SpinnerComponent,
    DeliveryComponent,
    SanitizeHtmlPipe,
    NewlineToBreakTag
  ],
  providers: [
    MenuItems
  ]
})
export class SharedModule { }
