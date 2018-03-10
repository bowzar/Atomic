define([""], function (require, factory) {
    'use strict';

    var pages = [
        {
            name: "Main",
            container: "body-framework-container",
            childrenContainer: "body-main-container",

            children: [

                {
                    name: "Example",
                    dir: "example",
                    childrenContainer: "body-main-content-container",
                    props: { isMain: true },
                    children: [

                        // {
                        //     name: "Defaults",
                        //     nameInner: "buttons-defaults",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Types",
                        //     nameInner: "buttons-types",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Sizes",
                        //     nameInner: "buttons-sizes",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Stretch",
                        //     nameInner: "buttons-stretch",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Active",
                        //     nameInner: "buttons-active",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Disabled",
                        //     nameInner: "buttons-disabled",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Group",
                        //     nameInner: "buttons-groups",
                        //     props: { gallery: "Buttons" },
                        // },

                        // {
                        //     name: "Group Justified",
                        //     nameInner: "buttons-groups-justified",
                        //     props: { gallery: "Buttons" },
                        // },

                        {
                            name: "Buttons",
                            props: { gallery: "Common" },
                        },

                        {
                            name: "Forms",
                            props: { gallery: "Common", isHot: false, },
                        },

                        {
                            name: "Inputs",
                            props: { gallery: "Common", isHot: false, },
                        },

                        {
                            name: "Popups",
                            props: { gallery: "Common", },
                        },

                        {
                            name: "Tabs",
                            nameInner: "tabcontrols",
                            props: { gallery: "Common", },
                        },

                        {
                            name: "Panels",
                            props: { gallery: "Common", },
                        },

                        {
                            name: "Lists",
                            props: { gallery: "Common" },
                        },

                        {
                            name: "Dialogs",
                            props: { gallery: "Common" },
                        },

                        {
                            name: "Tables",
                            props: { gallery: "Common" },
                        },

                        {
                            name: "Paginations",
                            props: { gallery: "Common" },
                        },

                        {
                            name: "Progress",
                            props: { gallery: "Common" },
                        },

                        // {
                        //     name: "React Study",
                        //     props: { gallery: "React" },
                        // },

                        {
                            name: "Simple Map",
                            nameInner: "arcgis-simple-map",
                            props: { gallery: "ArcGIS" },
                        },

                        {
                            name: "Northwind Orders",
                            props: { gallery: "Northwind", backReload: false },
                            children: [{
                                isBackground: true,
                                name: "Order",
                                params: ":orderId",
                                pathmodule: "views/example-northwind-orders/js/order-details-shell",
                                props: { backReload: false },
                            }],
                        },

                        // {
                        //     name: "Three Simple Cube",
                        //     props: { gallery: "Three" },
                        // },

                        {
                            name: "Three Walk",
                            nameInner: "three-simple-line",
                            props: { gallery: "Three" },
                        },

                        {
                            name: "Three Jump",
                            props: { gallery: "Three" },
                        },

                        {
                            name: "Three Earth",
                            props: { gallery: "Three" },
                        },

                        {
                            name: "Image Base64 Converter",
                            nameInner: "imagebase64converter",
                            props: { gallery: "Others" },
                        },]
                },

                {
                    name: "CS Document",
                    dir: "cs-document",
                    props: { isMain: true },
                }

            ],
        }];

    var innerTravesal = function (list, nodes, filter) {
        if (!nodes)
            return;

        for (var i = 0; i < nodes.length; i++) {
            var page = nodes[i];
            if (filter(page))
                list.push(page);

            innerTravesal(list, page.children, filter);
        }
    }

    pages.where = function (filter) {
        var list = [];

        innerTravesal(list, pages, filter);

        return list;
    };

    pages.first = function (filter) {
        var list = pages.where(filter);
        return list.length > 0 ? list[0] : null;
    };

    return pages;
});