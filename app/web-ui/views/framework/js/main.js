define(["vue"], function (Vue) {
    'use strict';

    var vm = new Vue({
        el: "#body-framework",
        data: {
            isBusy: false,
        }
    });

    return vm;
});