import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { states } from '@betaquick/grace-tree-constants';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address as PlacesAddress } from 'ngx-google-places-autocomplete/objects/address';

import { DeliveryInfo, UserProduct, Address } from '../../../shared/models/user-model';
import { AuthService } from '../../auth.service';
import { State } from '../../../shared/models/company-model';
import { Product } from '../../../shared/models/product-model';
import { utils } from '../../../shared/utils';
import { addressUtils } from '../../../shared/addressUtils';

@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {
  deliveryInfo: DeliveryInfo;
  products: Product[];
  stateArray: State[] = states;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.deliveryInfo = new DeliveryInfo();
    this.deliveryInfo.userProducts = [];
    // @ts-ignore
    this.deliveryInfo.preferences = {
      service_needs: null
    };
    this.deliveryInfo.address = new Address();
    this.deliveryInfo.address.state = this.stateArray[0].abbr;

    this.authService.getProducts()
      .subscribe(products => {
        this.products = products;

        this.deliveryInfo.userProducts = products.map(product => {
          return {productId: product.productId, status: false};
        });
      });
  }

  get aProductSelected(): boolean {
    return (this.deliveryInfo.userProducts || []).some(p => p.status);
  }

  setUserAddress(address: PlacesAddress) {
    this.deliveryInfo.address = addressUtils.convertAddress(address);
  }

  updateLatLon(event) {
    const name = _.get(event, 'target.name', '');
    const value = _.get(event, 'target.value', '');
    // clean up latlon - user has updated a field
    this.deliveryInfo.address.latitude = '';
    this.deliveryInfo.address.longitude = '';
    _.set(this.deliveryInfo.address, name, value);
  }

  toBoolean(value: string | boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  }

  addDeliveryInfo() {
    if (this.loading) {
      return;
    }

    this.deliveryInfo.userProducts = this.deliveryInfo.userProducts.map(product => {
      const  {productId, status} = product;
      return {productId, status: utils.getBoolean(status)};
    });

    if (!this.deliveryInfo.preferences.getEstimateInfo) {
      this.deliveryInfo.preferences.service_needs = null;
    }

    this.loading = true;

    const processedServiceNeeds = (this.deliveryInfo.preferences.service_needs || '').trim().length
      ? this.deliveryInfo.preferences.service_needs : '[Nothing Entered]';

    const getEstimateInfo = this.toBoolean(this.deliveryInfo.preferences.getEstimateInfo);

    this.authService.addDeliveryInfo({...this.deliveryInfo,
      preferences: {
        ...this.deliveryInfo.preferences,
        self_pickup: this.toBoolean(this.deliveryInfo.preferences.self_pickup),
        getEstimateInfo,
        // set service needs to null if opted out of estimate info
        service_needs: getEstimateInfo ? processedServiceNeeds : null
      }})
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/user-registration/agreement']),
        err => this.toastr.error(err)
      );
  }
}
