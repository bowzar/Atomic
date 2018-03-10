define(["jquery", "vue", "theme-controller"], function ($, Vue, themeController) {

    "use strict";
    var vmTheme = new Vue({
        el: "#themeControl",
        data: {
            themeIndex: "01",
            themes: [],
        },
        methods: {
            changeTheme: function (index) {
                themeController.changeTheme(index);
                this.themeIndex = index;
            },
            init: function () {

                var _this = this;
                this.themes = themeController.themes;
                themeController.applyUserTheme(function (config) {
                    _this.themeIndex = config.themeIndex;
                });
            }
        }
    });

    vmTheme.init();
});
