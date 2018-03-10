define(["jquery", "vue", "atomic"], function ($, Vue, Atomic) {
    'use strict';

    return {
        startup: function (args, callback) {

            this.dom.find("#email").val("juyang@yulintu.com");
            this.dom.find("#password").val(args && args.password ? args.password : "");
            this.dom.find("#remebertick").attr("checked", true);
            this.dom.find("#login").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.closeConfirm($(this));
            });

            setTimeout(function () {
                console.log("login startup");
                callback();
            }, 500);
        },
        shutdown: function () {
            console.log("login shutdown");
        },

        confirm: function () {
            var email = this.dom.find("#email").val();
            var password = this.dom.find("#password").val();

            if (email && password) {
                Atomic.dialog.showMessageSuccess(undefined, "You input email: " + email + ", password: " + password);
                return null;
            }
            else {
                return new Error("Email and password can not be null.");
            }
        }
    };
});