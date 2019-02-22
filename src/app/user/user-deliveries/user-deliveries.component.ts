import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user-deliveries',
  templateUrl: './user-deliveries.component.html',
  styleUrls: ['./user-deliveries.component.scss']
})
export class UserDeliveriesComponent implements OnInit {

  loading: boolean;

  deliveries = [];
  delivery: any = {};

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getDeliveries();
  }

  getDeliveries() {
    this.loading = true;

    this.userService.getDeliveries()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        deliveries => this.deliveries = deliveries,
        err => this.toastr.error(err)
      );
  }

  updateDelivery({ delivery }) {
    this.router.navigate(['/user/deliveries', delivery.deliveryId]);
  }
}
