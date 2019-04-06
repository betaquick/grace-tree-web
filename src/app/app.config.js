"use strict";
var environment_1 = require('../environments/environment');
var AppConfig = (function () {
    function AppConfig() {
    }
    AppConfig.readonly = API_URL = environment_1.environment.API_URL;
    return AppConfig;
}());
exports.AppConfig = AppConfig;
