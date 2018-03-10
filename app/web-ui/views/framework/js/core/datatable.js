define(["jquery", "lodash"], function ($, _) {
    'use strict';

    var DataTable = function (dom, options) {

        this.options = options;
        this.dom = dom;

        this.init();
    }

    DataTable.prototype.init = function () {

        var headers = null;

        if (this.dom[0].tagName === "TABLE") {
            this.dom.addClass("datatable");
            var headers = this.dom.find("thead > tr > th");
        }
        else {
            var tableHead = this.dom.find("table.table-head");
            var tableBodyFrame = this.dom.children("div.table-body-frame");
            var tableBody = tableBodyFrame.children("table.table-body");

            tableHead.addClass("datatable");
            tableBody.addClass("datatable");
            tableBodyFrame.addClass("flex-fill container-scrollable v-always");

            this.dom.addClass("v-flex");
            var headers = tableHead.find("thead > tr > th");
        }
        // var colgroup = tableHead.children("colgroup");
        // if (colgroup.length() > 0) {
        //     tableBody.children("colgroup").remove();
        //     tableBody.prepend($("<colgroup></colgroup>").html(colgroup.html()));
        // }

        var table = this;

        headers.each(function () {

            $(this).addClass("datatable-header sort-order-none");
            var h = $("<a></a>");
            h.html($("<span class='datatable-header-title'></span>").text($(this).text()));
            $(this).html(h);

            var field = $(this).data("field");
            if ($(this).data("sortable") !== "true" && !field)
                return;

            h.append("<span class='caret'></span>");
            $(this).addClass("sortable");

            var order = $(this).data("order");
            if (order) {
                $(this).addClass("sort-order-" + order);
                table.options.onsorting(field, order);
            }

            h.on("click", { header: $(this), }, function (e) {

                var order = e.data.header.data("order");
                if (order !== "asc")
                    order = "asc";
                else
                    order = "desc";

                headers.each(function () {
                    $(this).removeClass("sort-order-none");
                    $(this).removeClass("sort-order-asc");
                    $(this).removeClass("sort-order-desc");
                });

                e.data.header.addClass("sort-order-" + order);
                e.data.header.data("order", order);
                table.options.onsorting(field, order);
            });

        });
    }

    var defaults = {
        debounce: 300,
        onsorting: function (field, order) { },
    };

    $.fn.extend({
        "datatable": function (options) {
            var opts = $.extend({}, defaults, options);
            var table = new DataTable(this, opts);
            return table;
        }
    });
});