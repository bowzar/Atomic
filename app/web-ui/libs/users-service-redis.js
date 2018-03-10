var redis = require("../libs/datasource-redis");


var getUserConfig = async function (name) {

    try {
        var client = redis.create(true);
        var promise = new Promise(function (resolve, reject) {

            client.get("themeIndex", function (err, value) {
                if (err)
                    reject(err);
                else
                    resolve({ themeIndex: value || "02" });
            });
        });

        return await promise;
    }
    catch (error) {
        return { themeIndex: "02" };
    }
}

var setUserConfig = async function (name, config) {

    try {
        var client = redis.create();
        var promise = new Promise(function (resolve, reject) {

            client.set("themeIndex", config.themeIndex, function (err, value) {
                if (err)
                    reject(err);
                else
                    resolve({ success: true });
            });
        });

        return await promise;
    }
    catch (error) {
        return { success: false };
    }
}

exports.getUserConfig = getUserConfig;
exports.setUserConfig = setUserConfig;