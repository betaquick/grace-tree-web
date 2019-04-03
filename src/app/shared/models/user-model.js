"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var product_model_1 = require('./product-model');
var Profile = (function () {
    function Profile() {
        this.agreement = false;
    }
    return Profile;
}());
exports.Profile = Profile;
var Phone = (function () {
    function Phone() {
    }
    return Phone;
}());
exports.Phone = Phone;
var Email = (function () {
    function Email() {
    }
    return Email;
}());
exports.Email = Email;
var Address = (function () {
    function Address() {
        this.street = '';
    }
    return Address;
}());
exports.Address = Address;
var User = (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
var AuthDetails = (function () {
    function AuthDetails() {
    }
    return AuthDetails;
}());
exports.AuthDetails = AuthDetails;
var ResetPasswordDetails = (function () {
    function ResetPasswordDetails() {
    }
    return ResetPasswordDetails;
}());
exports.ResetPasswordDetails = ResetPasswordDetails;
var Credentials = (function (_super) {
    __extends(Credentials, _super);
    function Credentials() {
        _super.apply(this, arguments);
    }
    return Credentials;
}(User));
exports.Credentials = Credentials;
var RegisterUser = (function () {
    function RegisterUser() {
    }
    return RegisterUser;
}());
exports.RegisterUser = RegisterUser;
var UserProduct = (function (_super) {
    __extends(UserProduct, _super);
    function UserProduct() {
        _super.apply(this, arguments);
    }
    return UserProduct;
}(product_model_1.Product));
exports.UserProduct = UserProduct;
var DeliveryInfo = (function () {
    function DeliveryInfo() {
    }
    return DeliveryInfo;
}());
exports.DeliveryInfo = DeliveryInfo;
var ScheduleDelivery = (function () {
    function ScheduleDelivery() {
    }
    return ScheduleDelivery;
}());
exports.ScheduleDelivery = ScheduleDelivery;
