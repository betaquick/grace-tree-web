"use strict";
var throw_1 = require('rxjs/observable/throw');
var _ = require('lodash');
exports.utils = {
    handleError: function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            return throw_1._throw('Something went wrong: ' + _.get(error, 'error.message', 'Unknown'));
        }
        // The backend returned an unsuccessful response code.
        var body = _.get(error, 'error.body');
        var errorMsg = (typeof body === 'string') ? body : 'Something went wrong. Please contact support!';
        // return an observable with a user-facing error message
        return throw_1._throw(errorMsg);
    },
    getBoolean: function (value) {
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
