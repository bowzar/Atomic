define(["jquery", "vue"], function ($, Vue) {
    'use strict';

    return {
        startup: function (args, callback) {

            this.dom.find("#email").val("juyang@yulintu.com");
            this.dom.find("#remebertick").attr("checked", true);

            setTimeout(function () {
                console.log("login startup");
                callback();
            }, 500);
        },
        shutdown: function () {
            console.log("login shutdown");
        },
    };
});