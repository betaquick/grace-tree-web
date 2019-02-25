import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-delivery-request',
  templateUrl: './delivery-request.component.html',
  styleUrls: [
    './delivery-request.component.scss'
  ]
})

export class DeliveryRequestComponent implements OnInit {
  loading: boolean;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['userId'];
      const deliveryId = params['deliveryId'];
      if (userId && deliveryId) {
        this.acceptDeliveryRequest(userId, deliveryId);
      }
    });
  }

  acceptDeliveryRequest(userId: number, deliveryId: number) {
    this.loading = true;

    this.authService.acceptDeliveryRequest(userId, deliveryId)
    .subscribe(
      () => {
        this.loading = false;
        this.toastr.success('You accepted the delivery request');
      },
      err => this.toastr.error(err)
    );
  }
}
