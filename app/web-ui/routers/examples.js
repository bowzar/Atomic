var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();


router.get("/:name/sourcecode", function (req, res, next) {
    var name = req.params.name;
    var html = path.normalize(__dirname + "/../views/" + name + "/html/example.html");
    var js = path.normalize(__dirname + "/../views/" + name + "/js/example.js");
    var css = path.normalize(__dirname + "/../views/" + name + "/css/example.css");

    (async function name(params) {
        var htmlcontent = (fs.existsSync(html)) ? (fs.readFileSync(html).toString()) : "";
        var jscontent = (fs.existsSync(js)) ? (fs.readFileSync(js).toString()) : "";
        var csscontent = (fs.existsSync(css)) ? (fs.readFileSync(css).toString()) : "";

        res.send({ html: htmlcontent, js: jscontent, css: csscontent });
        res.end();
    })();
});

router.post("/theme", function (req, res, next) {
    themeConfig.themeIndex = req.body.themeIndex;
    res.send({ success: true });
    res.end();
});

module.exports = router;
