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
    let link;
    if (delivery.statusCode === DeliveryStatusCodes.Scheduled) {
      link = [`/company/setup-delivery/${delivery.userId}/delivery/${delivery.deliveryId}`];
    }
    this.setDelivery.emit({ action, delivery, link });
  }

  manageableDelivery(delivery: any): boolean {
    const { Requested, Scheduled } = DeliveryStatusCodes;
    return ([Scheduled, Requested].indexOf(delivery.statusCode) > -1) || delivery.usersCount > 1;
  }
}
