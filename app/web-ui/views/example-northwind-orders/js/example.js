define(["jquery", "vue", "lodash", "toastr", "atomic", "pages", "service-northwind"], function ($, Vue, _, toastr, Atomic, pages, NorthwindService) {
    'use strict';

    var vm = new Vue({
        el: "#northwind-orders",
        data: {
            atomic: Atomic,
            service: new NorthwindService(),

            isBusy: false,

            items: [],
            selectedItem: null,

            paginator: null,
            table: null,
            orderField: "",
            order: "asc",
            searchKey: "",

            pageIndex: 0,
            pageSize: 0,
        },
        watch: {
            searchKey: function (key) {
                this.search();
            }
        },
        methods: {
            init: function (doc, callback) {
                this.paginator = doc.find("#paginator").pagination({
                    total: 0,
                    pageSize: 20,
                    onchanged: function (pageIndex, pageSize) {

                        vm.pageIndex = pageIndex;
                        vm.pageSize = pageSize;

                        vm.refresh();
                    },
                });


                this.service.countOrders().then(function (c) {
                    vm.paginator.setTotal(c.count);
                    callback();
                });
            },

            initTable: function (doc) {

                this.table = doc.find("#table").datatable({
                    onsorting: function (field, order) {

                        vm.orderField = field;
                        vm.order = order;

                        vm.refresh();
                    },
                });
            },

            refresh: function (setBusy) {

                if (!vm.orderField || vm.pageSize <= 0)
                    return;

                if (setBusy !== false)
                    this.isBusy = true;
                this.selectedItem = null;

                vm.service.getOrders(vm.pageIndex, vm.pageSize, vm.orderField, vm.order, vm.searchKey)
                    .then(function (c) {

                        setTimeout(() => {
                            vm.items = c;

                            if (setBusy !== false)
                                vm.isBusy = false;

                        }, 100);

                    });
            },

            refreshAll: function () {

                this.isBusy = true;

                this.service.countOrders(this.searchKey).then(function (c) {
                    vm.paginator.setTotal(c.count);
                    // vm.refresh(false);

                    this.isBusy = false;
                });
            },

            search: _.debounce(function () {
                this.refreshAll();
            }, 500),

            select: function (item) {
                this.selectedItem = item;
            },

            viewDetails: function () {
                if (!this.selectedItem)
                    return;

                var page = pages.first(function (c) {
                    return c.nameInner === "northwind-orders";
                });

                location.href = page.location + "/order/" + this.selectedItem.OrderID;
            },

            updated: function (order) {
                toastr.success('Updated Success', order.EmployeeName);
                this.refreshAll();
            },
        },
    });

    return vm;
});