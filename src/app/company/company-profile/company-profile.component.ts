import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { states, PhoneTypes } from '@betaquick/grace-tree-constants';

import { User, Email, Phone, RegisterUser, Address } from '../../shared/models/user-model';
import { CompanyService } from '../company.service';
import { BusinessInfo, State } from '../../shared/models/company-model';
import { SessionStorage } from 'ngx-store';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: [
    './company-profile.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanyProfileComponent implements OnInit {

  isProfileEdit: boolean;
  @SessionStorage() user: RegisterUser = new RegisterUser();
  @SessionStorage() company: BusinessInfo = new BusinessInfo();
  placeholderAddress: Address;
  loading: boolean;
  errorMessage: string;
  stateArray: State[] = states;

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isProfileEdit = false;
    this.loading = false;

    this.placeholderAddress = new Address();
  }

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

  setCompanyAddress(address: Address) {
    this.company.companyAddress = '';
    this.cdRef.detectChanges();

    this.zone.run(() => {
      this.company.companyAddress = address.street;
      this.company.city = address.city;
      this.company.state = address.state;
      this.company.zip = address.zip;
      this.company.longitude = address.longitude;
      this.company.latitude = address.latitude;

      this.placeholderAddress = address;
    });
  }

  updateCompanyInfo() {
    const { firstName, lastName, password, confirmPassword } = this.user;
    if (password && password !== confirmPassword) {
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
      password,
      confirmPassword
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

    if (
      this.placeholderAddress.street === company.companyAddress &&
      this.placeholderAddress.city === company.city &&
      this.placeholderAddress.state === company.state
    ) {
      company.longitude = this.placeholderAddress.longitude;
      company.latitude = this.placeholderAddress.latitude;
    }

    this.companyService.updateCompanyInfo(company, user)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          this.user = data.user;
          this.company = data.company;
          this.toastr.success('Company profile updated successfully');
          this.isProfileEdit = false;
        },
        err => this.toastr.error(err)
      );
  }
}
