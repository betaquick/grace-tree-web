import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { states } from '@betaquick/grace-tree-constants';

import { AuthService } from '../../../shared/auth/auth.service';
import { IAddress } from '../../../shared/meta-data/user';

@Component({
  selector: 'app-add-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  products: Array<any> = [];
  address: IAddress = {
    street: '',
    city: '',
    state: states[0].abbr,
    zip: ''
  };
  loading: boolean;
  errorMessage: string;
  stateArray = states;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = false;

    this.authService.getProducts()
      .subscribe(products => {
        products.forEach(product => {
          product.status = '';
          this.products.push(product);
        });
      });
  }

  addDeliveryInfo(): void {
    if (this.loading === true) {
      return;
    }
    this.errorMessage = null;
    this.loading = true;

    const products = this.products.map(product => {
      const  { productId, status } = product;

      return {
        productId,
        status: status === "true"
      };
    });
    
    this.authService.addDeliveryInfo({ products, address: this.address })
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          if (this.authService.sync()) {
            this.router.navigate(['/home']);
          }
        },
        err => this.errorMessage = err.error.message
      );
  }
}
