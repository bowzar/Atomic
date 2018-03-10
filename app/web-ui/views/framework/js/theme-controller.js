define(["jquery", "service-users"], function ($, UsersService) {

    "use strict";

    var ThemeController = function () {
        this.themeIndex = "01";
        this.service = new UsersService();
        this.themes = [];

        this.init = function () {
            for (var i = 1; i < 11; i++) {
                var index = (Array(2).join('0') + i).slice(-2);
                var item = {};
                item.index = index;
                item.cssfile = "views/framework/css/theme" + index + ".css";
                this.themes.push(item);
            }

            return this.themes;
        }
    }

    ThemeController.prototype.changeTheme = function (index) {
        if (!index)
            return;

        this.themeIndex = index;
        sessionStorage.themeIndex = index;

        $("link[tag='theme'").attr("href", "views/framework/css/theme" + index + ".css");

        this.service.setThemeConfig(undefined, { themeIndex: this.themeIndex });
    }

    ThemeController.prototype.getUserThemeConfig = function () {
        return this.service.getThemeConfig();
    }

    ThemeController.prototype.applyUserTheme = function (callback) {

        var _this = this;
        this.service.getThemeConfig().then(function (config) {
            _this.changeTheme(config.themeIndex);
            callback(config);
        });
    }

    var tc = new ThemeController();
    tc.init();

    return tc;
});
