define([
    "jquery",
    "vue",
    "lodash",
    "atomic",
    "service-northwind",
    "views/example-northwind-orders/js/example"],
    function ($, Vue, _, Atomic, NorthwindService, vmExample) {
        'use strict';

        var vm = new Vue({
            el: "#order-details",
            data: {

                service: new NorthwindService(),

                format: "yyyy-mm-dd",
                dateInputName: "date",

                validator: null,

                countries: [],
                orderId: null,
                order: { Photo: "", CountryPhoto: "", },
            },
            methods: {

                startup: function (args, callback) {

                    vm.service.getCountries().then(function (c) {

                        c.splice(0, 0, {
                            ShipCountry: "",
                            item: "\
                                <div class='item-container'>\
                                    <span>无</span>\
                                </div>",
                        });

                        c.forEach(item => {
                            item.item = item.item || "\
                                            <div class='item-container image-text-h'>\
                                                <img src='data:image/jpeg;base64," + item.CountryPhoto + "' />\
                                                <span>" + item.ShipCountry + "</span>\
                                            </div>";
                        });

                        vm.countries = c;
                        vm.refresh(args, callback);
                    });
                },

                shutdown: function () {
                    // this.dom.find('.selectpicker').selectpicker('destroy', true);
                    this.validator.dispose();
                    vm.$destroy();
                },

                refresh: function (args, callback) {

                    this.orderId = args;
                    this.service.getOrderById(this.orderId).then(function (order) {

                        if (order && order.OrderDate) {
                            order.OrderDate = Atomic.ultis.formatJsonDate(order.OrderDate, vm.format);
                        }

                        vm.order = order;
                        vm.dialog.setCaptionText(order.EmployeeName);

                        if (callback)
                            callback();
                    });
                },

                onShown: function (next) {
                    console.log("onShown");

                    // this.dom.find('.selectpicker').selectpicker({ container: "body", dropupAuto: false });
                    // this.dom.find('.selectpicker').on("change", function () {
                    //     $(this).valid();
                    // });

                    var options = {

                        rules: {

                            freight: {
                                required: true,
                            },
                            date: {
                                required: true,
                                date: true,
                            },
                            country: {
                                required: true,
                            },
                            city: {
                                required: true,
                            },

                        },

                    }

                    this.validator = Atomic.validate.init(this.dom.find("#order-details-form"), options, {
                        errorBadges: [this.dom.find("#errorCount")],
                    });

                    // this.dom.find("#order-details-form").validate(options);

                    next();
                },

                onClosed: function (next) {
                    console.log("onClosed");
                    next();
                },

                onConfirm: function (onCompleted, onError, next) {
                    console.log("onConfirm");

                    var valid = this.dom.find("#order-details-form").valid();
                    if (!valid) {
                        onError();
                        return;
                    }

                    var name = vm.order.ShipCountry;
                    var country = vm.getCountry(name);
                    vm.order.CountryPhoto = country.CountryPhoto;

                    vm.service.updateOrder(vm.order).then(function (result) {
                        onCompleted();
                        vmExample.updated(vm.order);
                    }).catch(function (error) {
                        onError(error);
                    });
                },

                onCancel: function (next) {
                    console.log("onCancel");
                    next();
                },

                getCountry: function (name) {

                    for (let i = 0; i < vm.countries.length; i++) {
                        const element = vm.countries[i];
                        if (element.ShipCountry === name)
                            return element;
                    }

                    return null;
                },
            },
        })

        return vm;
    });