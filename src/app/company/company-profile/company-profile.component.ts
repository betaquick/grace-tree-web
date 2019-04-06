import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SessionStorage } from 'ngx-store';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address as PlacesAddress } from 'ngx-google-places-autocomplete/objects/address';

import { states, PhoneTypes } from '@betaquick/grace-tree-constants';

import { Email, Phone, User, Address } from '../../shared/models/user-model';
import { CompanyService } from '../company.service';
import { BusinessInfo, State } from '../../shared/models/company-model';
import { addressUtils } from '../../shared/addressUtils';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: [
    './company-profile.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanyProfileComponent implements OnInit, OnDestroy {

  isProfileEdit: boolean;
  user: User;
  company: BusinessInfo;
  password: string;
  confirmPassword: string;

  loading: boolean;
  errorMessage: string;
  stateArray: State[] = states;

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.user = this.companyService.user;
    this.company = this.companyService.company;

    this.isProfileEdit = false;
    this.loading = false;
  }

  ngOnDestroy() {}

  toggleUpdateProfile() {
    this.isProfileEdit = !this.isProfileEdit;

    if (this.isProfileEdit) {
      if (this.user.emails.length === 1) {
        const email = new Email();
        email.primary = false;

        this.user.emails.push(email);
      }

      if (this.user.phones.length === 1) {
        const phone = new Phone();
        phone.primary = false;
        phone.phoneType = PhoneTypes.HOME;

        this.user.phones.push(phone);
      }
    } else {
      const emails = _.filter(this.user.emails, email => !_.isEmpty(email.emailAddress));
      const phones = _.filter(this.user.phones, phone => !_.isEmpty(phone.phoneNumber));

      this.user.emails = emails;
      this.user.phones = phones;
    }
  }

  setBusinessAddress(address: PlacesAddress) {
    const add = addressUtils.convertAddress(address);
    this.company.companyAddress = add.street;
    this.company.city = add.city;
    this.company.state = add.state;
    this.company.zip = add.zip;
    this.company.latitude = add.latitude;
    this.company.longitude = add.longitude;
  }

  updateLatLon(event) {
    const name = _.get(event, 'target.name', '');
    const value = _.get(event, 'target.value', '');
    // clean up latlon - user has updated a field
    this.company.latitude = '';
    this.company.longitude = '';
    _.set(this.company, name, value);
  }

  updateCompanyInfo() {
    const { firstName, lastName } = this.user;
    if (this.password && this.password !== this.confirmPassword) {
      this.errorMessage = 'Password and confirm password don\'t match';
      return;
    }

    this.loading = true;

    const emails: Array<Email> = [];
    const phones: Array<Phone> = [];

    this.user.emails.forEach(email => {
      if (_.isEmpty(email.emailAddress)) {
        return;
      }

      emails.push(
        _.pick(email, ['emailAddress', 'primary'])
      );
    });

    this.user.phones.forEach(phone => {
      if (_.isEmpty(phone.phoneNumber)) {
        return;
      }

      phones.push(
        _.pick(phone, ['phoneNumber', 'primary', 'phoneType'])
      );
    });

    const user = {
      firstName,
      lastName,
      emails,
      phones,
      password: this.password,
      confirmPassword: this.password
    };

    const company: BusinessInfo = _.pick(
      this.company,
      [
        'companyId',
        'companyName',
        'companyAddressId',
        'companyAddress',
        'city',
        'state',
        'zip',
        'website'
      ]
    );

    this.companyService.updateCompanyInfo(company, user)
      .pipe(finalize(() => {
        this.loading = false;
        this.isProfileEdit = false;
      }))
      .subscribe(
        data => {
          this.user = data.user;
          this.company = data.company;
          this.toastr.success('Company profile updated successfully');
        },
        err => this.toastr.error(err)
      );
  }
}
