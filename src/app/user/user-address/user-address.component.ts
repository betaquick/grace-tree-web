import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { states } from '@betaquick/grace-tree-constants';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

import { UserService } from '../user.service';
import { Address } from '../../shared/models/user-model';
import { State } from '../../shared/models/company-model';

@Component({
  selector: 'app-user-profile-address',
  templateUrl: './user-address.component.html',
  styleUrls: [
    './user-address.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UserAddressComponent implements OnInit {

  newAddress: Address;
  placeholderAddress: Address;
  editMode: boolean;
  errorMessage: string;
  address: Address;
  loading: boolean;
  stateArray: State[] = states;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.editMode = false;
    this.loading = false;

    this.userService.getUserAddress()
      .subscribe(addy => {
        if (addy) {
          this.address = addy;
          this.placeholderAddress = addy;
        }
        this.newAddress = Object.assign({}, this.address);
      }, err => this.toastr.error(err));

  }

  setUserAddress(address: Address) {
    this.newAddress.street = '';
    this.cdRef.detectChanges();

    this.zone.run(() => {
      this.newAddress = Object.assign({}, address);
      this.placeholderAddress = Object.assign({}, this.newAddress);
    });
  }

  updateAddress() {
    this.loading = true;
    const { city, street, state, zip, longitude, latitude, deliveryInstruction } = this.newAddress;
    const newAddress: Address = { city, street, state, zip, deliveryInstruction };

    if (
      this.placeholderAddress.street === street &&
      this.placeholderAddress.city === city &&
      this.placeholderAddress.state === state
    ) {
      newAddress.longitude = longitude;
      newAddress.latitude = latitude;
    }

    this.userService.updateUserAddress(newAddress)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        address => {
          this.toastr.success('Address updated successfully');
          this.address = address;
          this.placeholderAddress = address;
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
