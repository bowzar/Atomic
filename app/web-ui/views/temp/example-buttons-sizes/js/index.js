define(["jquery", "vue", "views/example/js/example-model-factory"], function ($, Vue, factory) {
    'use strict';

    return {
        startup: function (element, args, doc, callback) {

            factory.createModel(element, function (vm) {
                require(["codemirror-helper", "tabcontrol-helper"],
                    function (CodeMirrorHelper, TabControlHelper) {

                        doc.ready(function () {

                            CodeMirrorHelper.fromTextArea("code-html", "htmlmixed");
                            CodeMirrorHelper.fromTextArea("code-js", "javascript");
                            CodeMirrorHelper.fromTextArea("code-css", "css");

                            callback();
                            setTimeout(function () {
                                TabControlHelper.apply(doc);
                            }, 1);
                        });
                    });
            });
        },
        shutdown: function (element) {
            // require.undef("views/example/js/navigator");
        },
    };
});