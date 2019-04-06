import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address as PlacesAddress } from 'ngx-google-places-autocomplete/objects/address';

import { states } from '@betaquick/grace-tree-constants';

import { Address } from '../../../shared/models/user-model';
import { BusinessInfo, State } from '../../../shared/models/company-model';
import { AuthService } from '../../auth.service';
import { addressUtils } from '../../../shared/addressUtils';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {
  businessInfo: BusinessInfo;
  loading: boolean;
  stateArray: State[] = states;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.businessInfo = new BusinessInfo();
    this.businessInfo.state = this.stateArray[0].abbr;
  }

  setBusinessAddress(address: PlacesAddress) {
    const add = addressUtils.convertAddress(address);
    this.businessInfo.companyAddress = add.street;
    this.businessInfo.city = add.city;
    this.businessInfo.state = add.state;
    this.businessInfo.zip = add.zip;
    this.businessInfo.latitude = add.latitude;
    this.businessInfo.longitude = add.longitude;
  }

  updateLatLon(event) {
    const name = _.get(event, 'target.name', '');
    const value = _.get(event, 'target.value', '');
    // clean up latlon - user has updated a field
    this.businessInfo.latitude = '';
    this.businessInfo.longitude = '';
    _.set(this.businessInfo, name, value);
  }

  addBusinessInfo() {
    if (this.loading === true) {
      return;
    }

    this.loading = true;

    this.authService.addBusinessInfo(this.businessInfo)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/company']),
        err => this.toastr.error(err)
      );
  }

}
