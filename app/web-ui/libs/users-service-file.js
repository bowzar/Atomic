var fs = require("fs");
var path = require("path");


var configNameUser = path.normalize(__dirname + "/../data/config/user.json");
var themeConfig = JSON.parse(fs.readFileSync(configNameUser).toString());


var saveUserConfig = function () {
    fs.writeFileSync(configNameUser, JSON.stringify(themeConfig));
}

var getUserConfig = async function (name) {

    return themeConfig;
}

var setUserConfig = async function (name, config) {

    themeConfig = config;
    saveUserConfig();
    return { success: true };
}

exports.getUserConfig = getUserConfig;
exports.setUserConfig = setUserConfig;