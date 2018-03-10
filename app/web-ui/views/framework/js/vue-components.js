define(["jquery", "vue", "ultilities"], function ($, Vue, Ultilities) {
    'use strict';

    var components = [];
    var register = function (name, template) {

        if (components.indexOf(name) >= 0)
            return;

        Vue.component(name, template);
        components.push(name);
    };

    register('loading', {
        template: '\
            <div class="loading-container">\
                <div class="loading">\
                    <span></span>\
                    <span></span>\
                    <span></span>\
                    <span></span>\
                    <span></span>\
                </div>\
            </div>',
    });


    register("datetimepicker", {
        template: '\
                <div class="input-group date" v-bind:data-date-format="format" v-bind:data-date="value">\
                    <input type="text" class="form-control" v-bind:value="value" readonly>\
                    <span class="input-group-addon">\
                        <button class="btn btn-default" type="button">\
                            <span class="fa fa-calendar"></span>\
                        </button>\
                    </span>\
                </div>',

        props: {
            value: {},
            format: {
                default: "yyyy-mm-dd",
            }
        },

        watch: {
            value: function (val) {

            },
        },

        mounted: function () {

            var _this = this;
            var el = $(this.$el);
            $(this.$el).datetimepicker({
                language: 'zh-CN',
                todayBtn: true,
                autoclose: true,
                todayHighlight: true,
                minView: 2,
            }).on('changeDate', function (e) {
                _this.$emit('input', Ultilities.formatDateAxis(e.date, _this.format));

                if (el.children("input").valid)
                    el.children("input").valid();
            });

            var name = $(this.$el).attr("name");
            $(this.$el).children("input").attr("name", name);
            $(this.$el).removeAttr("name");
        },
        destroyed: function () {
            $(this.$el).off();
            $(this.$el).datetimepicker("remove");
        },
        methods: {
        }
    });

    register("selectpicker", {
        template: '<select class="selectpicker show-tick form-control"><slot></slot></select>',

        props: {
            value: {},
        },

        data: function () {
            return {
                isInstalled: false,
            };
        },

        mounted: function () {
        },

        updated: function () {

            if (this.isInstalled || !this.value)
                return;

            var _this = this;
            var el = $(this.$el);

            el.selectpicker({ container: "body", dropupAuto: false });
            el.selectpicker("val", this.value);
            el.on("change", function (e) {
                _this.$emit('input', el.val());

                if (el.valid)
                    el.valid();
            });

            this.isInstalled = true;
        },

        destroyed: function () {
            $(this.$el).off();
            $(this.$el).selectpicker('destroy', true);
        },
        methods: {
        }
    });

    return { register };
});