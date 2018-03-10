define(["jquery", "vue", "atomic", "bootstrap-dialog"], function ($, Vue, Atomic, BootstrapDialog) {
    'use strict';

    return {
        startup: function (args, callback) {

            this.dom.find("#btnDefault").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.setType(BootstrapDialog.TYPE_DEFAULT);
            });
            this.dom.find("#btnPrimary").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.setType(BootstrapDialog.TYPE_PRIMARY);
            });
            this.dom.find("#btnSuccess").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.setType(BootstrapDialog.TYPE_SUCCESS);
            });
            this.dom.find("#btnInfo").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.setType(BootstrapDialog.TYPE_INFO);
            });
            this.dom.find("#btnWarning").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.setType(BootstrapDialog.TYPE_WARNING);
            });
            this.dom.find("#btnDanger").on("click", { dialog: this.dialog }, function (e) {
                e.data.dialog.setType(BootstrapDialog.TYPE_DANGER);
            });

            var _this = this;
            setTimeout(function () {

                console.log("login startup");
                callback(function () { Atomic.tabs.apply(_this.dom); });

            }, 500);
        },
        shutdown: function () {
            console.log("login shutdown");
        },
    };
});