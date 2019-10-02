import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';
import { UserStatus, DeliveryStatusCodes, UserDeliveryStatus } from '@betaquick/grace-tree-constants';

import { CompanyService } from '../company.service';
import { ScheduleDelivery, User } from '../../shared/models/user-model';
import { BusinessInfo } from '../../shared/models/company-model';

type SortKey = 'status' | 'distance';
enum DIRECTIONS {
  Backwards,
  Forwards
}
@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: [
    './company-search.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanySearchComponent implements OnInit, OnDestroy {
  private _refTable: ElementRef;
  @ViewChild('sortableTable') set refTable(ref: ElementRef) {
    this._refTable = ref;
  }
  @ViewChild('bulkScheduleRef') bulkScheduleRef: ElementRef;
  public DIRECTIONS = DIRECTIONS;
  mapView = true;
  userStatus = UserStatus;
  currentSortMethod: SortKey = 'distance';
  reversed = false;

  // initial center position for the map
  lat: number;
  lng: number;
  zoom = 8;

  LIMIT = 10;
  offset = 1;

  recipients = [];
  links = [];
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
    if (!this.mapView) {
      setTimeout(() => { this.attachSortEventListener();  });
    }
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
          this.recipients = [...this.addScheduledDeliveryInfo(data.users)];
          this.offset = 1;
          this.lat = data.coordinates.lat;
          this.lng = data.coordinates.lng;
        },
        err => this.toastr.error(err)
      );
  }

  addScheduledDeliveryInfo(users: {
    deliveries: any[];
    acceptedScheduled?: number;
    pendingScheduled?: number
  }[] = []): any[] {
    users.forEach(user => {
      user.acceptedScheduled = (user.deliveries || [])
        .filter(({ status }) => status === UserDeliveryStatus.Accepted).length;
      user.pendingScheduled = (user.deliveries || [])
        .filter(({ status }) => status === UserDeliveryStatus.Pending).length;
    });

    return users;
  }

  attachSortEventListener(): void {
    if (this._refTable) {
      Array.from((this._refTable.nativeElement as HTMLTableElement)
      .querySelectorAll('th[data-sort]'))
      .forEach(header => header
      .addEventListener('click', evt => {
        this.performSort((evt.target as HTMLElement).dataset['sort']);
      }));
    }
  }

  performSort(sortKey: SortKey | string): void {
    if (this.currentSortMethod === sortKey) {
      this.reversed = !this.reversed;
      this.recipients = [...this.recipients.reverse()];
    } else {
      this.currentSortMethod = sortKey as SortKey;
      this.reversed = false;
      if (['distance'].indexOf(sortKey) > -1) {
        this.recipients.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : -1);
      }
    }
    this.offset = 1;
  }

  getUniqueEmails(user: { email?: string; validEmails?: string[] }): string[] {
    return _.uniq([user.email, ...(user.validEmails || [])]);
  }

  getUniquePhoneNumbers(user: { phoneNumber?: string[] }): string[] {
    return _.uniq(user.phoneNumber || []);
  }

  sortingBy(key: string | SortKey): boolean {
    return this.currentSortMethod === key;
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

  getOverallIndex(index: number): number {
    return ((this.offset - 1) * this.LIMIT) + index;
  }
}
