define([], function () {
    'use strict';

    return {
        startup: function (args, callback) {

            var _this = this;
            require([
                "vue-components",
                "views/example/js/navigator",
                "views/example/js/main"],
                function (components, navigator, main) {
                    _this.metadata.status.before = function (child) {
                        main.isBusy = true;
                        navigator.selectedItem = child.name;
                    };
                    _this.metadata.status.after = function (child) {
                        main.isBusy = false;
                    };

                    components.register('example-page', {
                        props: ["page"],
                        template: "#template-example-page",
                    });

                    navigator.init(callback);
                });
        },
        shutdown: function () {
            require.undef("views/example/js/main");
            require.undef("views/example/js/navigator");
            // require.undef("views/example/js/example-model-factory");
            // require.undef("views/example/js/example-loader");
        },
    };
});

