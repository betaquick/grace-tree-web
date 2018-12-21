import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AddBusinessComponent } from './add-business.component';
import { AddBusinessRoutingModule } from './add-business-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AddBusinessRoutingModule,
    SharedModule
  ],
  declarations: [AddBusinessComponent]
})
export class AddBusinessModule { }
