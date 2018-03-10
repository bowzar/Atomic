define("service-northwind", ["jquery"], function ($) {
    'use strict';

    var NorthwindService = (function () {
        function NorthwindService() {

        }

        NorthwindService.prototype.getCountries = function () {
            return $.get("/northwind/countries");
        }

        NorthwindService.prototype.countOrders = function (searchKey) {
            return $.get("/northwind/orders/count", { searchKey });
        }

        NorthwindService.prototype.getOrders = function (pageIndex, pageSize, orderField, order, searchKey) {
            return $.get("/northwind/orders", { pageIndex, pageSize, orderField, order, searchKey });
        }

        NorthwindService.prototype.getOrderById = function (orderId) {
            return $.get("/northwind/orders/" + orderId);
        }

        NorthwindService.prototype.updateOrder = function (order) {
            return $.post("/northwind/orders/update", { data: JSON.stringify(order) });
        }



        return NorthwindService;
    })();

    return NorthwindService;
});
define("service-users", ["jquery"], function ($) {
    'use strict';

    var UsersService = (function () {
        function UsersService() {

        }

        UsersService.prototype.getThemeConfig = function (name) {
            return $.get("/users/theme", { name: name });
        }

        UsersService.prototype.setThemeConfig = function (name, config) {
            return $.post("/users/theme", config);
        }

        return UsersService;
    })();

    return UsersService;
});