define(["vue", "pages"], function (Vue, allPages) {
    'use strict';

    var vm = new Vue({
        el: "#navbar-header-nav",
        data: {
            selectedItem: "",
            pages: [],
        },
        methods: {
            init: function () {
                var pages = [];
                allPages.where(function (item) {
                    return item.props.isMain;

                }).forEach(function (element) {
                    pages.push(element);
                });

                this.pages = pages;
            },
        }
    });

    return vm;
});