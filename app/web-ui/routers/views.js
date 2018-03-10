var path = require("path");
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    var fileName = path.normalize(__dirname + "/../views/framework/html/index.html");
    res.sendFile(fileName);
    // console.log(fileName);
});

// router.get("/*", (req, res, next) => {
//     var fileName = path.normalize(__dirname + "/.." + req.path);
//     console.log(req.path);
//     next();
// });
router.get("/views/*", (req, res) => {
    var fileName = path.normalize(__dirname + "/.." + req.path);
    res.sendFile(fileName);
    // console.log(fileName);
});

module.exports = router;
