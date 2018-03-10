define(["jquery", "vue", "atomic", "pages"], function ($, Vue, Atomic, pages) {
    'use strict';

    var dlg = null;
    var dontResetLocation = false;
    var obj = {
        startup: function (args, callback) {

            dlg = Atomic.dialog.dialog("Order Details",
                {
                    pathhtml: "views/example-northwind-orders/html/order-details.html",
                },
                function () {
                },
                function (onCompleted, onError) {
                },
                function () {
                },
                function () {
                    if (!dontResetLocation)
                        obj.resetLocation();
                },
                {
                    icon: "fa fa-user-circle-o",
                    height: "410px",
                    cssClass: "dialog-lg",
                    confirmingText: "Saving...",
                });

            callback();
        },
        shutdown: function () {

            if (dlg.isCloseing || dlg.isClosed) {
                dlg = null;
                return;
            }

            dontResetLocation = true;
            dlg.close();
            dlg = null;
        },

        indicate: function (args) {

            if (!dlg.isShow)
                dlg.show(args[0]);
            else
                dlg.refresh(args[0]);
        },

        resetLocation: function () {
            var page = pages.first(function (c) { return c.nameInner === "northwind-orders"; });
            location.href = page.location;

        },
    };

    return obj;
});