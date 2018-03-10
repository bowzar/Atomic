define(["jquery", "vue", "views/example/js/example-model-factory"], function ($, Vue, factory) {
    'use strict';

    return {
        startup: function (args, callback) {

            var _this = this;
            factory.createModel(_this.metadata, function (vm) {
                require([
                    "codemirror-helper",
                    "atomic",
                    "views/example-dialogs/js/example"],
                    function (CodeMirrorHelper, Atomic, example) {

                        _this.dom.ready(function () {

                            CodeMirrorHelper.fromTextArea("code-html", "htmlmixed");
                            CodeMirrorHelper.fromTextArea("code-js", "javascript");
                            CodeMirrorHelper.fromTextArea("code-css", "css");

                            example.init(_this.dom);

                            callback();
                            setTimeout(function () {
                                _this.dom.find(".ctabs").tabcontrol();
                            }, 1);
                        });
                    });
            });
        },
        shutdown: function () {
            require.undef("views/example-dialogs/js/example");
        },
    };
});