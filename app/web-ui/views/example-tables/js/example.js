define(["jquery", "vue"], function ($, Vue) {
    'use strict';

    var obj = {};

    obj.init = function (doc) {

        var paginator1 = doc.find("#table1").datatable({
            onsorting: function (field, order) {
                console.log(field + ":" + order);
            },
        });
    };

    return obj;
});