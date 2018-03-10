var server = require("./app/web-ui/index");
// var server = require("./app/test-html/index");

let port = process.env.HTTP_PORT || 8888;

server.start(port);