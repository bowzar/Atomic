define(["jquery", "vue", "views/example/js/example-model-factory"], function ($, Vue, factory) {
    'use strict';

    return {
        startup: function (args, callback) {

            var _this = this;
            factory.createModel(_this.metadata, function (vm) {
                require(["codemirror-helper", "tabcontrol-helper"],
                    function (CodeMirrorHelper, TabControlHelper) {

                        _this.dom.ready(function () {

                            CodeMirrorHelper.fromTextArea("code-html", "htmlmixed");
                            CodeMirrorHelper.fromTextArea("code-js", "javascript");
                            CodeMirrorHelper.fromTextArea("code-css", "css");

                            callback();
                            setTimeout(function () {
                                _this.dom.find(".ctabs").tabcontrol();
                            }, 1);
                        });
                    });
            });
        },
        shutdown: function () {
            // require.undef("views/example/js/navigator");
        },
    };
});