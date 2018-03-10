define(["jquery", "toastr", "views/global/js/jquery.validate.min"], function ($, toastr) {
    "use strict";

    // $.validator.setDefaults({
    //     /*OBSERVATION: note how the ignore option is placed in here*/
    //     ignore: ':not(select:hidden, input:visible, textarea:visible)',

    //     /*...other options omitted to focus on the OP...*/

    //     // errorPlacement: function (error, element) {
    //     //     if (element.hasClass('bs-select')) {
    //     //         error.insertAfter('.bootstrap-select');
    //     //     } else {
    //     //         error.insertAfter(element);
    //     //     }
    //     /*Add other (if...else...) conditions depending on your
    //     * validation styling requirements*/
    //     // }
    // });

    toastr.options.positionClass = "toast-top-center"
    toastr.options.closeButton = true;
    toastr.options.closeDuration = 500;

    toastr.options.showEasing = 'easeInOutExpo';
    toastr.options.hideEasing = 'easeInOutExpo';
    toastr.options.closeEasing = 'easeInOutExpo';

    toastr.options.showMethod = 'slideDown';
    toastr.options.hideMethod = 'slideUp';
    toastr.options.closeMethod = 'slideUp';

    toastr.options.showDuration = 500;
    toastr.options.hideDuration = 500;

    toastr.options.timeOut = 3000;
    toastr.options.extendedTimeOut = 3000;
});