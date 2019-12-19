import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import * as _ from 'lodash';

import { utils } from '../../../shared/utils';

@Component({
    selector: 'app-delivery-preference',
    templateUrl: './preferences.component.html',
    styleUrls: [
      '../../../../assets/icon/icofont/css/icofont.scss',
      './preferences.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDeliveryPreferenceComponent implements OnInit, OnChanges {

  @Input() userProducts: any[] = [];
  @Input() readonly: boolean;
  @Output() deliveryPreferenceUpdatedEvent: EventEmitter<{productId: number; status: boolean}[]> = new EventEmitter<any>();
  isPreferenceEdit: boolean;
  loading: boolean;

  constructor() { }

  ngOnInit() {
    this.isPreferenceEdit = false;
  }

  ngOnChanges() {
    this.isPreferenceEdit = false;
    this.loading = false;
  }

  isBoolean(status) {
    return utils.getBoolean(status) ? 'Yes' : 'No';
  }

  updateDeliveryPreference() {
    if (this.loading === true) {
      return;
    }

    const userProducts = _.map(this.userProducts, userProduct => {
      const  { productId, status } = userProduct;

      return {
        productId,
        status: utils.getBoolean(status)
      };
    });

    this.loading = true;
    this.deliveryPreferenceUpdatedEvent.emit(userProducts);
  }
}
