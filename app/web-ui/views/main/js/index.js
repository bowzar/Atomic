define([], function () {
    'use strict';

    return {
        startup: function (args, callback) {

            var _this = this;
            require([
                "views/main/js/nav",
                "views/main/js/main",
                "views/main/js/theme",],
                function (nav, main) {
                    _this.metadata.status.before = function (child) {
                        main.isBusy = true;
                        nav.selectedItem = child.name;
                    };
                    _this.metadata.status.after = function (child) {
                        main.isBusy = false;
                    };

                    nav.init();

                    setTimeout(function () {
                        callback();
                    }, 100);
                });
        },
        shutdown: function () {
            require.undef("views/main/js/theme");
            require.undef("views/main/js/main");
            require.undef("views/main/js/nav");
        },

        indicate: function (args) {
            location.href = this.metadata.children[0].location;
        }
    };
});
