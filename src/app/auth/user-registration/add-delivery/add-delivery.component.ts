import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { states } from '@betaquick/grace-tree-constants';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { DeliveryInfo, UserProduct, Address } from '../../../shared/models/user-model';
import { AuthService } from '../../auth.service';
import { State } from '../../../shared/models/company-model';
import { Product } from '../../../shared/models/product-model';
import { utils } from '../../../shared/utils';

@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {
  deliveryInfo: DeliveryInfo;
  placeholderAddress: Address;
  products: Product[];
  stateArray: State[] = states;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = false;
    this.deliveryInfo = new DeliveryInfo();
    this.deliveryInfo.userProducts = [];
    this.deliveryInfo.address = new Address();
    this.deliveryInfo.address.state = this.stateArray[0].abbr;

    this.placeholderAddress = new Address();

    this.authService.getProducts()
      .subscribe(products => {
        this.products = products;

        products.forEach(product => {
          const userProduct: UserProduct = {
            productId: product.productId,
            status: false
          };
          this.deliveryInfo.userProducts.push(userProduct);
        });
      });
  }

  setUserAddress(address: Address) {
    this.deliveryInfo.address.street = '';
    this.cdRef.detectChanges();

    this.zone.run(() => {
      this.deliveryInfo.address = address;
      this.placeholderAddress = address;
    });
  }

  addDeliveryInfo() {
    if (this.loading === true) {
      return;
    }

    const userProducts = this.deliveryInfo.userProducts.map(product => {
      const  { productId, status } = product;

      return {
        productId,
        status: utils.getBoolean(status)
      };
    });

    if (
      this.placeholderAddress.street !== this.deliveryInfo.address.street ||
      this.placeholderAddress.city !== this.deliveryInfo.address.city ||
      this.placeholderAddress.state !== this.deliveryInfo.address.state
    ) {
      this.deliveryInfo.address.latitude = null;
      this.deliveryInfo.address.longitude = null;
    }

    this.deliveryInfo.userProducts = userProducts;

    this.loading = true;

    this.authService.addDeliveryInfo(this.deliveryInfo)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/user-registration/agreement']),
        err => this.toastr.error(err)
      );
  }
}
