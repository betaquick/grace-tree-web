import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { states } from '@betaquick/grace-tree-constants';
import { BusinessInfo, State } from '../../../shared/models/company-model';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../shared/models/user-model';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {
  businessInfo: BusinessInfo;
  placeholderAddress: Address;
  loading: boolean;
  stateArray: State[] = states;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = false;
    this.businessInfo = new BusinessInfo();
    this.businessInfo.state = this.stateArray[0].abbr;
  }

  setCompanyAddress(address: Address) {
    this.businessInfo.companyAddress = '';
    this.cdRef.detectChanges();

    this.zone.run(() => {
      this.businessInfo.companyAddress = address.street;
      this.businessInfo.city = address.city;
      this.businessInfo.state = address.state;
      this.businessInfo.zip = address.zip;
      this.businessInfo.longitude = address.longitude;
      this.businessInfo.latitude = address.latitude;

      this.placeholderAddress = address;
    });
  }

  addBusinessInfo() {
    if (this.loading === true) {
      return;
    }

    this.loading = true;

    if (
      this.placeholderAddress.street !== this.businessInfo.companyAddress ||
      this.placeholderAddress.city !== this.businessInfo.city ||
      this.placeholderAddress.state !== this.businessInfo.state
    ) {
      this.businessInfo.latitude = null;
      this.businessInfo.longitude = null;
    }

    this.authService.addBusinessInfo(this.businessInfo)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/company']),
        err => this.toastr.error(err)
      );
  }

}
