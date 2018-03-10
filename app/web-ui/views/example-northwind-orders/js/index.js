define(["jquery", "vue", "views/example/js/example-model-factory"], function ($, Vue, factory) {
    'use strict';

    var vmExample = null;

    return {
        startup: function (args, callback) {

            var _this = this;
            factory.createModel(_this.metadata, function (vm) {
                require([
                    "codemirror-helper",
                    "tabcontrol-helper",
                    "views/example-northwind-orders/js/example"],
                    function (CodeMirrorHelper, TabControlHelper, example) {

                        vmExample = example;
                        _this.dom.ready(function () {

                            CodeMirrorHelper.fromTextArea("code-html", "htmlmixed");
                            CodeMirrorHelper.fromTextArea("code-js", "javascript");
                            CodeMirrorHelper.fromTextArea("code-css", "css");

                            example.init(_this.dom, function () {
                                callback(function () {
                                    _this.dom.find(".ctabs").tabcontrol();
                                    example.initTable(_this.dom);
                                });
                            });
                        });
                    });
            });
        },
        shutdown: function () {
            vmExample.$destroy();
            require.undef("views/example-northwind-orders/js/example");
        },
    };
});