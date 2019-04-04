import { Component, OnInit, Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { states } from '@betaquick/grace-tree-constants';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address as PlacesAddress } from 'ngx-google-places-autocomplete/objects/address';

import { UserService } from '../user.service';
import { Address } from '../../shared/models/user-model';
import { State } from '../../shared/models/company-model';
import { addressUtils } from '../../shared/addressUtils';

@Component({
  selector: 'app-user-profile-address',
  templateUrl: './user-address.component.html',
  styleUrls: [
    './user-address.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UserAddressComponent implements OnInit {

  editMode: boolean;
  errorMessage: string;
  @Input() address: Address;
  loading: boolean;
  stateArray: State[] = states;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.editMode = false;
    this.loading = false;
  }

  setUserAddress(add: PlacesAddress) {
    this.address = {...this.address, ...addressUtils.convertAddress(add)};
  }
  
  updateLatLon(event) {
    const name = _.get(event, 'target.name', '');
    const value = _.get(event, 'target.value', '');
    // clean up latlon - user has updated a field
    this.address.latitude = '';
    this.address.longitude = '';
    _.set(this.address, name, value);
  }

  updateAddress() {
    this.loading = true;

    this.userService.updateUserAddress(this.address)
      .pipe(finalize(() => {
        this.loading = false;
        this.editMode = false;
      }))
      .subscribe(
        () => this.toastr.success('Address updated successfully'),
        err => this.toastr.error(err)
      );
  }
}
