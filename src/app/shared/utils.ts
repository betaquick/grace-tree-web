import { _throw } from 'rxjs/observable/throw';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';

export const utils = {
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return _throw('Something went wrong: ' + _.get(error, 'error.message', 'Unknown'));
    }
    // The backend returned an unsuccessful response code.
    console.error(`Backend returned code ${error.status}, ` + `body was: `, error.error);
    const body = _.get(error, 'error.body');
    const errorMsg = (typeof body === 'string') ? body : 'Something went wrong. Please contact support!';
    // return an observable with a user-facing error message
    return _throw(errorMsg);
  },

  getBoolean(value): boolean {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }
};
