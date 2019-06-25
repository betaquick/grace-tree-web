import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';
import { UserStatus, DeliveryStatusCodes, UserDeliveryStatus } from '@betaquick/grace-tree-constants';

import { CompanyService } from '../company.service';
import { ScheduleDelivery, User } from '../../shared/models/user-model';
import { BusinessInfo } from '../../shared/models/company-model';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: [
    './company-search.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanySearchComponent implements OnInit, OnDestroy {

  mapView = true;
  userStatus = UserStatus;

  // initial center position for the map
  lat: number;
  lng: number;
  zoom = 8;

  recipients = [];
  recipient: any = {};

  loading: boolean;
  searchParams = {
    address: '',
    radius: 10,
    includePause: false
  };

  @SessionStorage() user: User = new User();
  @SessionStorage() company: BusinessInfo = new BusinessInfo();

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;

    this.lat = 37.4219931;
    this.lng = -122.0851244;

    this.getGeocode();
  }

  ngOnDestroy() {}

  getGeocode() {
    const { latitude, longitude } = this.company;
    if (latitude && longitude) {
      this.lat = parseFloat(latitude);
      this.lng = parseFloat(longitude);
    }
  }

  toggleListMapView() {
    this.mapView = !this.mapView;
  }

  search() {
    this.loading = true;

    const { address, radius, includePause } = this.searchParams;

    this.companyService.searchUsers(address, radius, includePause)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          if (_.size(data.users) === 0) {
            this.toastr.warning('No users found.');
          }
          this.recipients = data.users;
          this.lat = data.coordinates.lat;
          this.lng = data.coordinates.lng;
        },
        err => this.toastr.error(err)
      );
  }

  convertToNumber(str: string) {
    return parseFloat(str);
  }

  getIconURL(status: string) {
    if (status === this.userStatus.Ready) {
      return '../../../assets/images/marker-green.png';
    }

    return '../../../assets/images/marker-yellow.png';
  }

  openNote(modal: any, recipient) {
    this.recipient = recipient;
    modal.show();
  }

  toggleAllUsers(e) {
    let recipients;
    if (e.target.checked) {
      recipients = this.recipients.map(recipient => {
        if (recipient.status === UserStatus.Pause) {
          return { ...recipient, selected: true };
        }

        return recipient;
      });
    } else {
      recipients = this.recipients.map(recipient => {
        if (recipient.status === UserStatus.Pause) {
          return { ...recipient, selected: false };
        }

        return recipient;
      });
    }

    this.recipients = recipients;
  }

  sendRequest() {
    const users = [];
    this.recipients.forEach(recipient => {
      if (recipient.selected) {
        users.push(recipient.userId);
      }
    });

    if (users.length > 0) {
      this.loading = true;
      const delivery: ScheduleDelivery = {
        statusCode: DeliveryStatusCodes.Requested,
        assignedToUserId: this.user.userId,
        userDeliveryStatus: UserDeliveryStatus.Pending,
        users,
        isAssigned: false
      };

      this.companyService.scheduleDelivery(delivery)
        .pipe(finalize(() => this.loading = false))
        .subscribe(
          () => this.toastr.success('Delivery request has been sent successfully'),
          err => this.toastr.error(err)
        );
    } else {
      window.alert('You must select one or more users');
    }
  }
}
