define(["jquery"], function ($) {
    'use strict';

    var obj = {};

    obj.init = function (doc) {
        doc.find('[data-toggle="tooltip"]').tooltip();
        doc.find('[data-toggle="popover"]').popover();
    };

    return obj;
});