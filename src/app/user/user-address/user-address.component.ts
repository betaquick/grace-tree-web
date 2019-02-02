import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';

import * as _ from 'lodash';
import { RegisterUser } from '../../shared/models/user-model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile-address',
  templateUrl: './user-address.component.html',
  styleUrls: [
    './user-address.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UserAddressComponent implements OnInit {

  newAddress: any;
  editMode: boolean;
  errorMessage: string;
  address: any;
  loading: boolean;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.address = {
      city: '',
      street: '',
      state: '',
      zip: '',
      deliveryInstruction: ''
    };

    this.newAddress = {};
  }

  ngOnInit() {
    this.editMode = false;
    this.loading = false;

    this.userService.getUserAddress()
      .subscribe(addy => {
        if (addy !== undefined) {
          this.address = addy;
        }
        this.newAddress = Object.assign({}, this.address);
      }, err => this.toastr.error(err));

  }


  updateAddress() {
    this.loading = true;
    const { city, street, state, zip, deliveryInstruction } = this.newAddress;
    const newAddress = { city, street, state, zip, deliveryInstruction };
    this.userService.updateUserAddress(newAddress)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (address) => {
          this.toastr.success('Address updated successfully');
          this.address = address;
          this.newAddress = Object.assign({}, address);
          this.editMode = false;
          this.loading = false;
        },
        err => {
          this.toastr.error(err);
          this.loading = false;
        }
      );
  }

}
