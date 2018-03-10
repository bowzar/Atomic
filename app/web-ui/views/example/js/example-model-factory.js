define(["jquery", "vue", "views/example/js/example-loader"], function ($, Vue, exampleLoader) {
    'use strict';

    return {
        createModel: function (element, callback) {

            var m = new Vue({
                el: "#example-page",
                data: { page: { html: "", js: "", css: "" } },
            });

            exampleLoader.getPage(element).then(function (page) {
                m.page = page;
                callback(m);
            });
        }
    };
});