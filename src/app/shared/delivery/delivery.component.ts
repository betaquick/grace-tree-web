import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, OnDestroy } from '@angular/core';
import { SessionStorage } from 'ngx-store';
import { UserTypes, DeliveryStatusCodes, UserDeliveryStatus } from '@betaquick/grace-tree-constants';

import { User } from '../models/user-model';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryComponent implements OnInit, OnDestroy {
  @Input() deliveries: Array<any>;
  @Output() setDelivery = new EventEmitter<any>();

  @SessionStorage() user: User = new User();

  public statusCodes = DeliveryStatusCodes;
  public userTypes = UserTypes;
  public userDeliveryStatus = UserDeliveryStatus;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  emitDelivery(action, delivery) {
    this.setDelivery.emit({ action, delivery });
  }
}
