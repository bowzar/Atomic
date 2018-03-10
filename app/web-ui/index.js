var express = require("express");
var bodyParser = require('body-parser');
var app = express();

function start(port) {
    "use strict";

    app.use(bodyParser.json({ limit: "50mb", extended: true }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

    var routerViews = require("./routers/views");
    var routerExamples = require("./routers/examples");
    var routerUsers = require("./routers/users");
    var routerNorthwind = require("./routers/northwind");

    app.use("/", routerViews);
    app.use("/examples", routerExamples);
    app.use("/users", routerUsers);
    app.use("/northwind", routerNorthwind);

    var server = app.listen(port, () => {
        // var port = server.address().port;
        console.log("Server started at %d", port);
    });
}

exports.start = start;