require.config({
    baseUrl: "",
    paths: {
        "jquery": "views/global/js/jquery-3.2.1",
        "domReady": "views/global/js/domReady",
        "bootstrap": "views/global/js/bootstrap.min",
        "bootstrap-select": "views/global/js/bootstrap-select",
        "bootstrap-dialog": "views/global/js/bootstrap-dialog",
        "bootstrap-datetimepicker": "views/global/js/datetimepicker/bootstrap-datetimepicker",
        "bootstrap-datetimepicker-zh-CN": "views/global/js/datetimepicker/locales/bootstrap-datetimepicker.zh-CN",
        "bootstrap-table": "views/global/js/bootstrap-table/bootstrap-table",
        "bootstrap-table-zh-CN": "views/global/js/bootstrap-table/locale/bootstrap-table-zh-CN",
        "vue": "views/global/js/vue",
        "director": "views/global/js/director.min",
        "lodash": "views/global/js/lodash",
        "toastr": "views/global/js/toastr.min",
        "three": "views/global/js/three",
        "stats": "views/global/js/stats",
        "tween": "views/global/js/Tween",

        "react":"views/global/js/react.development",
        "react-dom":"views/global/js/react-dom.development",
        "babel":"views/global/js/babel.min",



        "esri": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/esri",
        "dojo": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/dojo",
        "dojox": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/dojox",
        "moment": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/moment",
        "dijit": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/dijit",
        "dgrid": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/dgrid",
        "dstore": "views/global/js/arcgis_js_v46_api/arcgis_js_api/library/4.6/dstore",


        "entry": "views/framework/js/index",


        "atomic": "views/framework/js/core/atomic",
        "actionqueue": "views/framework/js/core/action-queue",
        "plugin-context": "views/framework/js/core/plugin-context",
        "tabcontrol-helper": "views/framework/js/core/tabcontrol-helper",
        "dialog": "views/framework/js/core/dialog",
        "ultilities": "views/framework/js/core/ultilities",
        "codemirror-helper": "views/framework/js/codemirror-helper",
        "animator": "views/framework/js/core/animator",

        "pages": "views/framework/js/pages",
        "theme-controller": "views/framework/js/theme-controller",
        "vue-components": "views/framework/js/vue-components",

        "service-users": "views/framework/js/lib/service-users",
        "service-northwind": "views/framework/js/lib/service-northwind",
    },
    shim: {
        "bootstrap": {
            deps: ['jquery'],
        },
        "director": {
            exports: "Router",
        },
        // "three": {
        //     exports: "THREE",
        // },
        "bootstrap-datetimepicker-zh-CN": {
            deps: ['bootstrap-datetimepicker'],
        },
        "bootstrap-datetimepicker": {
            deps: ['jquery', 'bootstrap'],
        },
        "bootstrap-select": {
            deps: ['jquery', 'bootstrap'],
        },
        "bootstrap-dialog": {
            deps: ['jquery', 'bootstrap'],
        },
        "bootstrap-table-zh-CN": {
            deps: ['bootstrap-table'],
        },
        "bootstrap-table": {
            deps: ['jquery', 'bootstrap'],
        },
    }
});

require(["domReady"], function (domReady) {
    domReady(function () {
        require(["entry"], function () {
        });
    });
});
