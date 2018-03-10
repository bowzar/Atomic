define([], function () {
    'use strict';

    Date.prototype.format = function (fmt) {

        fmt = fmt || "yyyy-mm-dd";

        var o = {
            "m+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "M+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };

        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

        return fmt;
    }

    var obj = {};

    obj.formatJsonDate = function (jsonDate, fmt) {
        return new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10)).format(fmt);
    };

    obj.formatDateAxis = function (dateAxis, fmt) {
        return new Date(dateAxis).format(fmt);
    }

    return obj;
});