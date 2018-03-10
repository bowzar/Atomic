define(["jquery", "vue", "views/example/js/example-model-factory"], function ($, Vue, factory) {
    'use strict';


    var example = null;

    return {
        startup: function (args, callback) {

            var _this = this;
            factory.createModel(_this.metadata, function (vm) {
                require([
                    "codemirror-helper",
                    "tabcontrol-helper",
                    "views/example-arcgis-simple-map/js/example"],
                    function (CodeMirrorHelper, TabControlHelper, exampleClass) {

                        _this.dom.ready(function () {

                            CodeMirrorHelper.fromTextArea("code-html", "htmlmixed");
                            CodeMirrorHelper.fromTextArea("code-js", "javascript");
                            CodeMirrorHelper.fromTextArea("code-css", "css");


                            callback();
                            setTimeout(function () {
                                _this.dom.find(".ctabs").tabcontrol();
                                example = new exampleClass();
                                example.init(_this.dom);
                            }, 1);
                        });
                    });
            });
        },
        shutdown: function () {
            example.dispose();
            example = null;
            require.undef("views/example-arcgis-simple-map/js/example");
        },
    };
});