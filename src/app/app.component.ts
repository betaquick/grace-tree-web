import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import * as LogRocket from 'logrocket';
import { SessionStorage } from 'ngx-store';


import { User } from './shared/models/user-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ChipDump';
  @SessionStorage() user: User = new User();

  constructor(private router: Router) { }

  ngOnInit() {
    LogRocket.init('xclwbm/grace-tree-services');
    if (this.user && this.user.email) {
      LogRocket.identify(`${this.user.userId}`, {
        name: `${this.user.firstName} ${this.user.lastName}`,
        email: this.user.email
      });
    }
    window.onerror = function (message, file, line, col, error) {
      LogRocket.captureException(error);
      return false;
    };
    window.addEventListener('error', function (e) {
        LogRocket.captureException(e.error);
        return false;
    });
    window.addEventListener('unhandledrejection', function (e) {
      LogRocket.captureException(new Error((e as PromiseRejectionEvent).reason.message));

    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
