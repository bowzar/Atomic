define(["jquery"], function ($) {
    'use strict';

    var UsersService = (function () {
        function UsersService() {

        }

        UsersService.prototype.getThemeConfig = function (name) {
            return $.get("/users/theme", { name: name });
        }

        UsersService.prototype.setThemeConfig = function (name, config) {
            return $.post("/users/theme", config);
        }

        return UsersService;
    })();

    return UsersService;
});