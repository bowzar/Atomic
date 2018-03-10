
var express = require("express");
var router = express.Router();


var service = require("../libs/users-service-file");
// var service = require("../libs/users-service-redis");


router.get("/theme", async function (req, res, next) {

    var config = await service.getUserConfig(undefined);
    res.send(config);
    res.end();
});

router.post("/theme", async function (req, res, next) {

    var result = await service.setUserConfig(undefined, { themeIndex: req.body.themeIndex });
    res.send(result);
    res.end();
});

module.exports = router;
