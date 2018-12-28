import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { states } from '@betaquick/grace-tree-constants';
import { BusinessInfo, State } from '../../../shared/models/company-model';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
