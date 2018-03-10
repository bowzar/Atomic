var fs = require("fs");
var path = require("path");
var moment = require('moment');
var express = require("express");
var _ = require("lodash");

var pathOrders = path.normalize(__dirname + "/../data/northwind/orders.json");
var orders = JSON.parse(fs.readFileSync(pathOrders).toString());

var router = express.Router();

var contains = function (target, key) {
    if (!target)
        return false;

    if (typeof target !== "string")
        return target.toString().indexOf(key) >= 0;

    return target.indexOf(key) >= 0;
}

router.get("/countries", function (req, res, next) {

    var result = _.map(orders, function (c) {
        return {
            ShipCountry: c.ShipCountry,
            CountryPhoto: c.CountryPhoto
        };
    });

    result = _.uniqWith(result, function (a, b) {
        return a.ShipCountry === b.ShipCountry;
    });

    res.send(result);
    res.end();
});

router.get("/orders/count", function (req, res, next) {

    var searchKey = req.query.searchKey;
    var result = _.filter(orders, function (c) {
        return searchKey ?
            contains(c.EmployeeName, searchKey) ||
            contains(c.ShipCountry, searchKey) ||
            contains(c.ShipCity, searchKey) ||
            contains(c.ShipPostalCode, searchKey) ||
            contains(c.Freight, searchKey)
            : true;
    });

    res.send({ count: result.length });
    res.end();
});

router.get("/orders", function (req, res, next) {

    var pageIndex = parseInt(req.query.pageIndex);
    var pageSize = parseInt(req.query.pageSize);
    var orderField = req.query.orderField || "Freight";
    var order = req.query.order || "asc";
    var searchKey = req.query.searchKey;

    var result = _.filter(orders, function (c) {
        return searchKey ?
            contains(c.EmployeeName, searchKey) ||
            contains(c.ShipCountry, searchKey) ||
            contains(c.ShipCity, searchKey) ||
            contains(c.ShipPostalCode, searchKey) ||
            contains(c.Freight, searchKey)
            : true;
    });
    result = _.orderBy(result, [orderField], [order]);
    result = _.slice(result, pageIndex * pageSize, pageIndex * pageSize + pageSize);

    var startIndex = pageIndex * pageSize + 1;
    result.forEach((element, index) => {
        element.Index = startIndex + index;
    });

    res.send(result);
    res.end();
});

router.get("/orders/:orderId", function (req, res, next) {

    var orderId = parseInt(req.params.orderId);

    var result = _.filter(orders, function (c) { return c.OrderID === orderId });
    var order = _.head(result);

    res.send(order);
    res.end();
});

router.post("/orders/update", function (req, res, next) {

    var order = JSON.parse(req.body.data);
    var orderId = order.OrderID;

    var orderDate = moment(order.OrderDate);
    order.OrderDate = "/Date(" + Date.parse(orderDate) + ")/";

    var result = _.filter(orders, function (c) { return c.OrderID === orderId });
    var orderOld = _.head(result);

    for (const key in orderOld) {
        orderOld[key] = order[key];
    }

    res.send({ success: true });
    res.end();
});


module.exports = router;
