define(["vue"], function (Vue) {
    'use strict';

    var vm = new Vue({
        el: "#body-main",
        data: {
            isBusy: false,
        }
    });

    return vm;
});