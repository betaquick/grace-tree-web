import { Component, OnInit } from '@angular/core';
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
    this.deliveryInfo.address = new Address();
    this.deliveryInfo.address.state = this.stateArray[0].abbr;

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

    this.deliveryInfo.userProducts = userProducts;

    this.loading = true;

    this.authService.addDeliveryInfo(this.deliveryInfo)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/user']),
        err => this.toastr.error(err)
      );
  }
}
