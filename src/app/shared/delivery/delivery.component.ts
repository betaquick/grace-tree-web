import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { SessionStorage } from 'ngx-store';
import { UserTypes } from '@betaquick/grace-tree-constants';
import { DeliveryStatusCodes } from '@betaquick/grace-tree-constants';

import { User } from '../models/user-model';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryComponent implements OnInit {
  @Input() deliveries: Array<any>;
  @Output() setDelivery = new EventEmitter<any>();

  public statusCodes = DeliveryStatusCodes;

  constructor() {}

  ngOnInit() {}

  emitDelivery(delivery) {
    this.setDelivery.emit(delivery);
  }
}
