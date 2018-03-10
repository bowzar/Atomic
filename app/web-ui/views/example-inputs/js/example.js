define(["jquery"], function ($) {
    'use strict';

    var obj = {};

    obj.init = function (doc) {

        doc.find('.selectpicker').selectpicker({
            selectAllText: "全选",
            deselectAllText: "全不选",
            noneResultsText: "未找到关键字对应的记录",
            maxOptionsText: function (numAll, numGroup) {
                return ["选择的数量不能超过 {n}", "分组中选择的数量不能超过 {n}"];
            },
        });

        doc.find('.date').datetimepicker({
            language: 'zh-CN',
            todayBtn: true,
            autoclose: true,
            container: "#preview",
            todayHighlight: true,
            minView: 2,
        });
    };

    return obj;
});