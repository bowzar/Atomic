define([
    "director",
    "pages",
    "views/framework/js/router-builder",
    "views/framework/js/main"], function (Router, pages, builder, main) {
        'use strict';
        var first = undefined;
        var routes = {};
        var root = {
            status: {
                before: function (element) {
                    main.isBusy = true;
                },
                after: function (element) {
                    main.isBusy = false;
                },
            },
            children: pages,
        };

        routes["/"] = {
            on: function () {
                location.href = "#/main";
            }
        };

        pages.forEach(function (element) {
            builder.installPage(root, element, routes);
        });

        var router = Router(routes).configure({ strict: false });
        router.init();

        if (location.hash.indexOf("#") < 0)
            location.href = "#";

        return router;
    });