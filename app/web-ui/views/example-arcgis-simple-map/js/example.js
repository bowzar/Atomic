define(["jquery", "vue", "three"], function ($, Vue, THREE) {
    'use strict';

    var Shell = function () {


        this.dispose = function () {

        }

        this.init = function (doc) {

            require([
                "esri/Map",
                "esri/views/MapView",
                "dojo/domReady!"
            ], function (Map, MapView) {

                var map = new Map({
                    basemap: "streets"
                });

                var view = new MapView({
                    container: "viewDiv",
                    map: map,
                    zoom: 4,
                    center: [15, 65] // longitude, latitude
                });

            });
        };
    };

    return Shell;
});