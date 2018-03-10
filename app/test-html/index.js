var path = require("path");
var express = require("express");
var bodyParser = require('body-parser');
var app = express();

function start(port) {
    "use strict";

    app.use(bodyParser.urlencoded({ extended: false }));

    app.get("/", (req, res) => {
        var fileName = path.normalize(__dirname + "/index.html");
        res.sendFile(fileName);
    });
    app.get("/tabs", (req, res) => {
        var fileName = path.normalize(__dirname + "/tabs.html");
        res.sendFile(fileName);
    }); 
    
    app.get("/jquery", (req, res) => {
        var fileName = path.normalize(__dirname + "/../web-ui/views/global/js/jquery-3.2.1.js");
        res.sendFile(fileName);
    });

    var server = app.listen(port, () => {
        console.log("Server started at %d", port);
    });
}

exports.start = start;