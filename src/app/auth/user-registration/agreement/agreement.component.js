"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var operators_1 = require('rxjs/operators');
var AgreementComponent = (function () {
    function AgreementComponent(authService, router, toastr) {
        this.authService = authService;
        this.router = router;
        this.toastr = toastr;
        this.user = new User();
    }
    AgreementComponent.prototype.ngOnInit = function () {
        this.loading = false;
        this.acceptAcceptment = false;
    };
    AgreementComponent.prototype.acceptAgreement = function () {
        var _this = this;
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.authService.acceptAgreement()
            .pipe(operators_1.finalize(function () { return _this.loading = false; }))
            .subscribe(function () { return _this.router.navigate(['/verification']); }, function (err) { return _this.toastr.error(err); });
    };
    __decorate([
        SessionStorage()
    ], AgreementComponent.prototype, "user");
    AgreementComponent = __decorate([
        core_1.Component({
            selector: 'app-agreement',
            templateUrl: './agreement.component.html',
            styleUrls: [
                './agreement.component.scss',
                '../../../../assets/icon/icofont/css/icofont.scss'
            ]
        })
    ], AgreementComponent);
    return AgreementComponent;
}());
exports.AgreementComponent = AgreementComponent;
