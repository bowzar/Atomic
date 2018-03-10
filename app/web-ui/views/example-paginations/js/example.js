define(["jquery", "vue"], function ($, Vue) {
    'use strict';

    var obj = {};

    obj.init = function (doc) {

        var paginatorlog1 = doc.find("#paginationlog1");
        var paginator1 = doc.find("#pagination1").pagination({
            total: 886,
            pageSize: 50,
            onchanged: function (pageIndex, pageSize) {
                paginatorlog1.val(paginatorlog1.val() + "\n" + "Paginator changed, pageIndex is " + pageIndex + ", pageSize is " + pageSize);
            },
        });
    };

    return obj;
});