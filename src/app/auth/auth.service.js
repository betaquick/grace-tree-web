"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var operators_1 = require('rxjs/operators');
var _ = require('lodash');
var ngx_store_1 = require('ngx-store');
var app_config_1 = require('../app.config');
var user_model_1 = require('../shared/models/user-model');
var utils_1 = require('../shared/utils');
var company_model_1 = require('../shared/models/company-model');
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.isLoggedIn = false;
        this.token = '';
        this.user = new user_model_1.User();
        this.company = new company_model_1.BusinessInfo();
    }
    AuthService.prototype.ngOnDestroy = function () { }; // event empty method is needed to allow ngx-store handle class destruction
    AuthService.prototype.register = function (regUser) {
        return this.http
            .post(app_config_1.AppConfig.API_URL + "/auth/register", regUser)
            .pipe(operators_1.map(this.handleSuccessAuth.bind(this)), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.login = function (authUser) {
        var _this = this;
        return this.http
            .post(app_config_1.AppConfig.API_URL + "/auth/login", authUser)
            .pipe(operators_1.map(function (res) {
            _this.user = _.get(res, 'body');
            return _this.user;
        }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.fetchUser = function (userId) {
        return this.http
            .get(app_config_1.AppConfig.API_URL + "/user/" + userId)
            .pipe(operators_1.map(this.handleSuccessAuth.bind(this)), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.requestResetPassword = function (email) {
        return this.http
            .post(app_config_1.AppConfig.API_URL + "/auth/forgot-password", { email: email })
            .pipe(operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.confirmResetPasswordToken = function (token) {
        return this.http.get(app_config_1.AppConfig.API_URL + "/auth/reset/" + token)
            .pipe(operators_1.map(function (response) { return _.get(response, 'body'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.resetPassword = function (resetPassword) {
        return this.http.post(app_config_1.AppConfig.API_URL + "/auth/reset-password", resetPassword)
            .pipe(operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.addBusinessInfo = function (businessInfo) {
        var _this = this;
        return this.http
            .post(app_config_1.AppConfig.API_URL + "/user/company", businessInfo)
            .pipe(operators_1.map(function (response) {
            var body = _.get(response, 'body');
            _this.company = _.get(body, 'company');
            return body;
        }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.getProducts = function () {
        return this.http.get(app_config_1.AppConfig.API_URL + "/products")
            .pipe(operators_1.map(function (response) { return _.get(response, 'body.products'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.addDeliveryInfo = function (deliveryInfo) {
        return this.http.post(app_config_1.AppConfig.API_URL + "/user/new-delivery-info", deliveryInfo)
            .pipe(operators_1.map(function (response) { return _.get(response, 'body'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.acceptAgreement = function () {
        return this.http.post(app_config_1.AppConfig.API_URL + "/user/agreement", null)
            .pipe(operators_1.map(function (response) { return _.get(response, 'body'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.verify = function (body, verifyType) {
        return this.http.post(app_config_1.AppConfig.API_URL + "/auth/verify", { body: body, verifyType: verifyType })
            .pipe(operators_1.map(function (response) { return _.get(response, 'body'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.validateToken = function (verifyType, token) {
        return this.http.put(app_config_1.AppConfig.API_URL + "/auth/validate/" + verifyType + "/" + token, null)
            .pipe(operators_1.map(function (response) { return _.get(response, 'body'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.acceptDeliveryRequest = function (userId, deliveryId) {
        return this.http.put(app_config_1.AppConfig.API_URL + "/user/deliveries/" + userId + "/" + deliveryId, null)
            .pipe(operators_1.map(function (response) { return _.get(response, 'body'); }), operators_1.catchError(utils_1.utils.handleError));
    };
    AuthService.prototype.logout = function () {
        this.isLoggedIn = false;
        this.user = null;
        this.company = null;
        this.token = '';
    };
    AuthService.prototype.handleSuccessAuth = function (response) {
        var credentials = _.get(response, 'body');
        this.token = _.get(credentials, 'token');
        this.user = _.get(credentials, 'user');
        this.company = _.get(credentials, 'company', null);
        this.isLoggedIn = true;
        return credentials;
    };
    __decorate([
        ngx_store_1.SessionStorage()
    ], AuthService.prototype, "isLoggedIn");
    __decorate([
        ngx_store_1.SessionStorage()
    ], AuthService.prototype, "token");
    __decorate([
        ngx_store_1.SessionStorage()
    ], AuthService.prototype, "user");
    __decorate([
        ngx_store_1.SessionStorage()
    ], AuthService.prototype, "company");
    AuthService = __decorate([
        core_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
