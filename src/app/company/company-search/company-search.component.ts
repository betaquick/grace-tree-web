import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { UserStatus } from '@betaquick/grace-tree-constants';

import { CompanyService } from '../company.service';
import { User } from '../../shared/models/user-model';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})
export class CompanySearchComponent implements OnInit {

  mapView = true;
  userStatus = UserStatus;

  // initial center position for the map
  lat: number;
  lng: number;
  zoom = 8;

  styles: any = [{
    featureType: 'all',
    stylers: [{
      saturation: -80
    }]
  }, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      hue: '#00ffee'
    }, {
      saturation: 50
    }]
  }, {
    featureType: 'poi.business',
    elementType: 'labels',
    stylers: [{
      visibility: 'off'
    }]
  }];

  users = [];
  user: any = {};

  loading: boolean;
  searchParams = {
    address: '',
    radius: 30
  };

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;

    this.lat = 37.4219931;
    this.lng = -122.0851244;
  }

  toggleListMapView() {
    this.mapView = !this.mapView;
  }

  search() {
    this.loading = true;

    this.companyService.searchUsers(this.searchParams.address, this.searchParams.radius)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          this.users = data.users;
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

  openNote(modal: any, user) {
    this.user = user;

    modal.show();
  }
}
