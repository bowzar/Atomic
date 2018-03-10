var Redis = require("ioredis");

var create = function (isSlave) {

    var options = {
        sentinels: [
            { host: 'redis-sentinel0', port: 26380 },
            { host: 'redis-sentinel1', port: 26381 },
            { host: 'redis-sentinel2', port: 26382 }],
            // { host: 'localhost', port: 26380 },
            // { host: 'localhost', port: 26381 },
            // { host: 'localhost', port: 26382 }],
        name: 'mymaster',
    };

    if (isSlave)
        options.role = "slave";

    var redis = new Redis(options);
    return redis;
}

exports.create = create;