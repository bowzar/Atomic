define(["jquery", "lodash"], function ($, _) {
    'use strict';

    var Paginator = function (dom, options) {

        this.options = options;
        this.dom = dom;

        this.pageIndex = 0;
        this.pageCount = 0;
        this.pageSize = options.pageSize;
        this.total = 0;
        this.pageFirstIndex = 0;
        this.pageLastIndex = 0;

        var _this = this;
        this.onchanged = _.debounce(function () {

            _this.options.onchanged(_this.pageIndex, _this.pageSize);

        }, this.options.debounce);

        this.init();
    }

    Paginator.prototype.init = function () {

        this.dom.addClass("cpagination cpagination-common");

        this.btnFirst = $("<button class='btn btn-default cpagination-btn'><span >首页</span></button>");
        this.btnPrevious = $("<button class='btn btn-default cpagination-btn'><span >上一页</span></button>");
        this.btnNext = $("<button class='btn btn-default cpagination-btn'><span ></span>下一页</button>");
        this.btnLast = $("<button class='btn btn-default cpagination-btn'><span ></span>尾页</button>");

        this.txtPrefix = $("<span class='cpagination-item cpagination-pre'>第</span>");
        this.txtSuffix = $("<span class='cpagination-item cpagination-suf'></span>");
        this.txtPer = $("<span class='cpagination-item cpagination-per cpagination-pre'>每页</span>");
        this.txtSpace = $("<div class='cpagination-space'></div>");

        this.itemInput = $("<input type='number' class='cpagination-input form-control'>");

        this.txtStatistics = $("<div class='cpagination-statistics cpagination-item cpagination-suf'><span></span></div>");

        this.itemSelect = $("<select class='cpagination-select selectpicker dropup show-tick form-control'></select>");
        for (var i = 0; i < this.options.pageSizes.length; i++)
            this.itemSelect.append($("<option value='" + this.options.pageSizes[i] + "'>" + this.options.pageSizes[i] + "</option>"));

        this.dom.append(this.btnFirst);
        this.dom.append(this.btnPrevious);

        this.dom.append(this.txtPrefix);
        this.dom.append(this.itemInput);
        this.dom.append(this.txtSuffix);

        this.dom.append(this.btnNext);
        this.dom.append(this.btnLast);

        this.dom.append(this.txtPer);
        this.dom.append(this.itemSelect);

        this.dom.append(this.txtSpace);
        this.dom.append(this.txtStatistics);

        this.itemSelect.selectpicker({ dropupAuto: true });
        this.itemSelect.selectpicker("val", this.options.pageSize);


        this.itemSelect.on('changed.bs.select', { paginator: this }, function (e) {
            e.data.paginator.pageSize = parseInt($(this).selectpicker("val"));
            e.data.paginator.reset();
        });

        this.itemInput.on('input propertychange', { paginator: this }, function (e) {
            e.data.paginator.pageIndex = parseInt($(this).val());
            e.data.paginator.reset();
        });

        this.btnFirst.on('click', { paginator: this }, function (e) {
            e.preventDefault();
            e.data.paginator.pageIndex = 0;
            e.data.paginator.reset();
        });

        this.btnLast.on('click', { paginator: this }, function (e) {
            e.preventDefault();
            e.data.paginator.pageIndex = e.data.paginator.pageCount - 1;
            e.data.paginator.reset();
        });

        this.btnPrevious.on('click', { paginator: this }, function (e) {
            e.preventDefault();
            e.data.paginator.pageIndex--;
            e.data.paginator.reset();
        });

        this.btnNext.on('click', { paginator: this }, function (e) {
            e.preventDefault();
            e.data.paginator.pageIndex++;
            e.data.paginator.reset();
        });

        this.setTotal(this.options.total);
    }

    Paginator.prototype.setTotal = function (total) {
        this.total = total;
        this.reset();
    }

    Paginator.prototype.reset = function () {

        this.pageCount = Math.ceil(this.total / this.pageSize);

        if (isNaN(this.pageIndex))
            this.pageIndex = 0;
        if (this.pageIndex >= this.pageCount)
            this.pageIndex = this.pageCount - 1;
        if (this.pageCount > 0 && this.pageIndex < 0)
            this.pageIndex = 0;

        this.pageFirstIndex = this.pageIndex * this.pageSize + 1;
        this.pageLastIndex = this.pageIndex * this.pageSize + this.pageSize;
        if (this.pageLastIndex > this.total)
            this.pageLastIndex = this.total;

        this.txtSuffix.text("页，共 " + this.pageCount + " 页");
        this.txtStatistics.text(this.total === 0 ? "无" :
            "从 " + this.pageFirstIndex + " 到 " + this.pageLastIndex + " 条，共 " + this.total + " 条");

        var inputVal = this.itemInput.val();
        if (inputVal !== this.pageIndex)
            this.itemInput.val(this.pageIndex + 1);

        this.btnFirst.attr("disabled", this.pageIndex <= 0);
        this.btnPrevious.attr("disabled", this.pageIndex <= 0);
        this.btnLast.attr("disabled", this.pageIndex >= this.pageCount - 1);
        this.btnNext.attr("disabled", this.pageIndex >= this.pageCount - 1);

        this.onchanged();
    }

    var defaults = {
        pageSizes: [5, 10, 20, 50, 100, 200, 500, 1000],
        pageSize: 20,
        total: 0,
        debounce: 200,
        onchanged: function (pageIndex, pageSize) { },
    };

    $.fn.extend({
        "pagination": function (options) {
            var opts = $.extend({}, defaults, options);
            var paginator = new Paginator(this, opts);
            return paginator;
        }
    });
});